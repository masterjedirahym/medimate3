# MediMate App for Fall 2018

A demo app to show how to build apps. This app was used to demonstrate the process of building software to beginner programming students in Fall of 2018, in the ISAT 340 course. The propsed application is productivity software for medical professionals. The application allows them to view important information about the patient and monitor the patient's status through real time data. This first iteration of the project is minimum viable product, and provides the general capability of viewing patient information as well as assigning patients to doctors. 
Pitch: The MediMate App strives to take the stress out of the emergency room experience for physicians and nurses as well as family members and friends. Through wearable technology, the MediMate platform will be able to continuously record the patient’s vitals in real time over the duration of their stay in the hospital. Family members, friends, and other loved ones can access this information through their mobile devices via software. This will keep loved ones at ease when they must attend to priorities and duties that require them to leave the patient in question at the hospital. Physicians, nurses, and other medical professionals can monitor the status of multiple patients on this platform through a dashboard that will display information about vitals, patient medical information, treatment options that have been administered, and general logistics about the patient’s stay.

## How to Install this Project Locally

Follow these instructions **CAREFULLY**:

1. Open up a terminal/console window
2. Navigate to the place on your hard drive where you want to download the project, e.g. `mkdir ~/dev && cd ~/dev`
3. Clone the repo: `git clone https://github.com/masterjedirahym/medimate3`
4. Navigate to the `frontend` directory: `cd medimate3/frontend`
5. Run npm install to install 3rd party packages for the **frontend** part: `npm i`
6. Navigate to the `backend` direcory: `cd ../backend`
7. Run npm install again to install 3rd party packages for the **backend** part: `npm i`
8. Start up the FeathersJS backend server: `npm start`
9. Confirm that it is running by visiting [http://localhost:3030](http://localhost:3030) in a browser. You should see a splash screen with the FeathersJs logo on it.
10. Minimize the terminal window. **DO NOT CLOSE IT OR STOP THE FEATHERS SERVER!!**
11. Open up a **SECOND** terminal/console window
12. Navigate to the `frontend` directory: `cd ~/dev/medimate3/frontend`
13. Start up the VueJs dev server: `npm run serve`
14. Visit the frontend project in a browser at [http://localhost:8080](http://localhost:8080)
15. Feel free to play around with it. All of the data you are modifying is stored in a **local** copy of the dabase (in `~/dev/medimate3/backend/httc.sqlite3`) so you won't mess anybody or anything up if you add/edit/delete any of the records there. You can always re-clone the database if you want it to go back to the way it was when you started.
16. Play around with the code (if you've got the VSCode `code` command installed on your system: [mac](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line) | [windows](https://code.visualstudio.com/docs/editor/command-line#_launching-from-command-line)). You can open the full project (frontend AND backend) from the command line using: `code ~/dev/medimate3` (assumes you cloned it where directed in steps 2 and 3). If you make changes to the **backend** code, you'll have to restart Feathers before the changes will take effect. If you make changes in the **frontend** code, they should automatically be recompiled and displayed in your browser.

## Helpful Documentation

Here are the 3rd party libraries/tools used to create this project:

* [FeathersJS](https://docs.feathersjs.com/): runs the backend
  * [knex](https://knexjs.org/): database driver for SQLite
  * [feathers-knex](https://github.com/feathersjs-ecosystem/feathers-knex): adapter that allows you to use `knex` with `feathersjs`
  * [SQLite](https://www.sqlite.org/index.html): lightweight, portable, relational database (Their docs are not the best for total beginners--I recommend googling for a better tutorial. The [W3Schools SQL tutorial](https://www.w3schools.com/sql/default.asp) should apply to everything you might need to do with SQLite.)
  * [DB Browser for SQLite](https://sqlitebrowser.org/): this is not strictly part of the code, but it was very helpful for creating the database initially and it can be used to inspect/edit what's actually being put in the DB by our app
* [VueJS](https://vuejs.org/v2/guide/index.html): runs the frontend
  * [VueJS Router](https://router.vuejs.org/): for creating/managing navigation and the URL structure for the frontend app
  * [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start): UI (user interface) framework that supplies all of the components that make the app look great
  * [VeeValidate](https://baianat.github.io/vee-validate/guide/getting-started.html): a library for validating user input on forms which is critical for making sure that users are easily able to interact with the app without corrupting their data
  * [@feathersjs/client](https://github.com/feathersjs/feathers/tree/master/packages/client): a bundle of Feathers-related packages that allows the **frontend** to more easily interact with the **backend**
  * [Axios](https://www.npmjs.com/package/axios): a library for making HTTP requests. we use this in conjunction with `@feathersjs/client` to make REST API requests against our backend server
  * [vue-async-computed](https://www.npmjs.com/package/vue-async-computed): this is a little package to make it easier for Vue to manage [`computed` properties](https://vuejs.org/v2/guide/computed.html) that rely on asynchronous data sources (like the REST API)

## Tutorials

There are A LOT of skills needed to build a project like this. As I've said in class many, many, many times, the list of skills and knowledge necessary to do development is changing constantly. As a budding developer, your **most important task** is NOT writing code, but developing the discipline and practice of teaching yourself all of the new knowledge and skills needed to build something. So, here are some tutorials I would recommend:

* [**The "official" VueJs tutorial**](https://vuejs.org/v2/guide/index.html):
Pitched toward people who already have some experience, but you should **absolutely** read through this whole site, and familiarize yourself with its structure so that you can refer back to it when you need it.
* [**Vue Mastery**](https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance):
This is an **excellent** resource. My business partner and former student Adam Maas referred this site to me. It is what he used to learn Vue. (Please note, there are many, many tutorials online and you would do well to try out a bunch of them until you find the one that "clicks" best with you. The same goes for all of the tutorials I'm recommending.)
* [**The "official" Feathers tutorial**](https://docs.feathersjs.com/guides/basics/readme.html):
This, and the "chat" application tutorial that is on the same site are good introductions to Feathers, but they assume you are already at least a minimally experienced developer.
* **Introduction to REST API Development**:
This is a critical piece of understanding for modern data architectures as **almost all** of the data in the world right now lives in the cloud and is accessible via some sort of REST API. I haven't had a chance to really go through these in detail, but here are several tutorials I found by googling:
  * [Lynda.com's REST API course](https://www.lynda.com/Web-Development-tutorials/Learning-REST-APIs/651230-2.html): Please note that [**JMU has a site license for Lynda.com**](https://sites.jmu.edu/lynda/) so you can access ALL of their content for **FREE!!!** I would highly recommend searching their courses for other topics in this class 
  * [A Beginner's Tutorial for Understanding REST APIs](https://mlsdev.com/blog/81-a-beginner-s-tutorial-for-understanding-restful-api)
  * [REST API Tutorial](https://www.restapitutorial.com/index.html)
  * [How to design a REST API](https://restfulapi.net/rest-api-design-tutorial-with-example/)

## Acknowledgements

We would like to thank Dr. Benton for all of the assistance and feedback that he provided throughout the duration of the course and the development of the project.   