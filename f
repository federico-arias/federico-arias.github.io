			{{ $currentPage := . }}
			<ul class="nav-menu">
				{{ range .Site.Menus.main }}
				<li class="nav-menu{{if or ($currentPage.IsMenuCurrent "main" .) ($currentPage.HasMenuCurrent "main" .) }}--active{{end}}">
					<a href="{{ .URL }}" title="{{ .Title }}">{{ .Name }}</a></li>
				{{ end }}
			</ul>
