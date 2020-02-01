+++
title = "The wizard pattern in React"
description = ""
date = "2020-01-22"
draft = true
tags = ""
+++

One of the most common scenarios when developing with React is

```javascript
const ModulesListHome = ({ match, location }) => {
	const wizardPathsByStep = {
		"1": match.url,
		"2": match.url + newInstrumentPath
	};
	const step = useSelector(s => s.newinstrument.step);

	if (wizardPathsByStep[step] !== location.pathname)
		return <Redirect to={wizardPathsByStep[step]} />;

	return (
		<Switch>
			<Route
				exact
				component={ModulesList}
				path={match.path}
			/>
			<Route
				component={CreateInstrument}
				path={`${match.path}${newInstrumentPath}`}
			/>
		</Switch>
	);
};
 ```
