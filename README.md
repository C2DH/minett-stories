# minett-stories
> REMIX Minett Stories


Running Minett Stories on [SNext.js](https://github.com/gffuma/snext)

React 18 Powered Server Side Rendering.
This App can also be deployed as a Sigle Page Application

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:7000](http://localhost:7000) to view it in your browser.

The page will reload when you make changes.

### `yarn build`

Builds the app for production to the `.snext` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### `yarn staticize`

This command should be run after `build`.
Exports your app as static website under `build-static` folder by recursively crawling all links or explicit
by follwing `useCrawl` directive.

Your app is ready to be deployed!

### `yarn staticize-spa`

This command should be run after `build`.
Exports you website as single page application under `build` folder.

Your app is ready to be deployed!
