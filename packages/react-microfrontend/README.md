# @cmra/react

A component to export and import microfrontends on your react application

## Import

Just use this way:

```
 // index.js

 import { ImportMicrofrontend } from '@cmra/react';

 ReactDOM.render((
   <ImportMicrofrontend>
     <App />
   </ImportMicrofrontend>
 ), document.getElementById('root'));


 // App.js
 import { withMicrofrontend } from '@cmra/react';

 const App = ({ microfrontends }) => (
   <div>
     {
       Object.keys(microfrontends).map(microfrontend => (
         <div>
           {microfrontend.content}
         </div>
       ))
     }
   </div>
 );

 export default withMicrofrontend(App);
```

## Export

On your microfrontend `index.js` file:

```
import App from './App';
import { ExportMicrofrontend } from '@cmra/react';

ExportMicrofrontend(App);

```
