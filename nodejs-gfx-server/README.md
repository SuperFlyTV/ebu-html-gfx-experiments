# Node.js Graphics Server

This is a simple Node.js server that:

* Has a REST based **External API** to control graphics
* Serves a webpage that can be played in a browser / CasparCG / vmix / OBS
* Plays "Super-gfx-templates" from a local folder




## Getting started

* Install and build the server
  ```
  npm install
  npm run build
  ```
* Run the server
 ```
 npm start
 ```
* Place graphics templates in the _templates folder_.
* Open a browser and go to `http://localhost:5271/render` to see the rendered web page.
* Control the renderer by using the REST API.


## "Super-gfx-templates"??

The Super-gfx-templates are HTML-files that are designed to work with this server.

## Rest API

`http://localhost:5271/api`
