+++
title = "Testing a file upload handler in Golang"
description = "We test a file upload handler by creating an image dynamically"
date = "2019-05-24"
draft = false
+++

There are [multiple][1] [examples][2] around the web about uploading a file in Go. Not so many about testing these type of handlers. Below, you can find an example of a simple way of testing your handler. 

```go
func TestUploadImage(t *testing.T) {
	//Set up a pipe to avoid buffering
	pr, pw := io.Pipe()
	//This writers is going to transform 
	//what we pass to it to multipart form data
	//and write it to our io.Pipe
	writer := multipart.NewWriter(pw)

	go func() {
		defer writer.Close()
		//we create the form data field 'fileupload'
		//wich returns another writer to write the actual file 
		part, err := writer.CreateFormFile("fileupload", "someimg.png")
		if err != nil {
			t.Error(err)
		}

		//https://yourbasic.org/golang/create-image/
		img := createImage()

		//Encode() takes an io.Writer.
		//We pass the multipart field
		//'fileupload' that we defined
		//earlier which, in turn, writes
		//to our io.Pipe
		err = png.Encode(part, img)
		if err != nil {
			t.Error(err)
		}
	}()

	//We read from the pipe which receives data
	//from the multipart writer, which, in turn,
	//receives data from png.Encode().
	//We have 3 chained writers !
	request := httptest.NewRequest("POST", "/", pr)
	request.Header.Add("Content-Type", writer.FormDataContentType())

	response := httptest.NewRecorder()
	handler := UploadFileHandler()
	handler.ServeHTTP(response, request)

	t.Log("It should respond with an HTTP status code of 200")
	if response.Code != 200 {
		t.Errorf("Expected %s, received %d", 200, response.Code)
	}
	t.Log("It should create a file named 'someimg.png' in uploads folder")
	if _, err := os.Stat("./uploads/someimg.png"); os.IsNotExist(err) {
		t.Error("Expected file ./uploads/someimg.png' to exist")
	}
}
```

[1]: https://undebugable.wordpress.com/2017/04/15/golang-simple-file-upload-using-go-languange/
[2]: https://zupzup.org/go-http-file-upload-download/

