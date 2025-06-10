<div align="center">
<img src=".\Wiki\Application Images\PavedWay_Solo_Logo.png" alt="PavedWay Logo" height="150px" width="300px"></img>
<h1>Paved Way</h1>
</div>
<div align="center">
<q>Gestisci. Segnala. Circola. Tutto con Paved Way.</q>
</div>
<div>
<br>
<p>Progetto di Ingegneria del software, in collaborazione con il comune e l'università di Trento, dell'anno 2024/2025</p>
<p><i>Gruppo 5: Nicola Panozzo, Tommaso Agosti, Valerio Cassone</i></p>
</div>
<div align="center">
<a href=".\Wiki\Deliverables\D1\D1Gruppo5.pdf">Deliverable D1</a>
<a href=".\Wiki\Deliverables\D2\D2Gruppo5.pdf">Deliverable D2</a>
<a href=".\Wiki\Deliverables\D3\D3Gruppo5.pdf">Deliverable D3</a>
<a href=".\Wiki\Deliverables\D4\D4Gruppo5.pdf">Deliverable D4</a>
</div>
<div>
<pre class="notranslate"><code>
PaveWay/
├── backend/                                # BACKEND FILES
│   ├── src/         
│   │   ├── config
│   │   │   └── paths.js
│   │   ├── database
│   │   │   └── DatabaseClient.js
│   │   ├── models                          # DATABASE MODELS
│   │   │   ├── Admin.js
│   │   │   ├── Citizen.js
│   │   │   ├── Comment.js
│   │   │   ├── Duration.js
│   │   │   ├── Location.js
│   │   │   ├── Notification.js
│   │   │   ├── Report.js
│   │   │   ├── Site.js
│   │   │   └── User.js
│   │   ├── routes
│   │   │   ├── authRoutes.js
│   │   │   ├── index.js
│   │   │   ├── locationRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── pathRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── siteRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services
│   │   │   ├── AuthService.js
│   │   │   ├── NotificationService.js
│   │   │   ├── PathService.js
│   │   │   ├── ReportService.js
│   │   │   ├── SiteService.js
│   │   │   └── UserService.js
│   │   ├── utils
│   │   │   ├── createError.js
│   │   │   ├── createTest.js
│   │   │   ├── distanceFilter.js
│   │   │   ├── tokenChecker.js
│   │   │   ├── toValidFloat.js
│   │   │   ├── toValidInt.js
│   │   │   └── Validator.js
│   │   └── app.js
│   ├── tests/                              # DATABASE TESTS
│   │   ├── auth.test.js
│   │   ├── notifications.test.js
│   │   ├── paths.test.js
│   │   ├── reports.test.js
│   │   ├── setup.js
│   │   ├── sites.test.js
│   │   └── users.tests.js
│   ├── jest.config.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/                               # FRONTEND FILES
│   ├── public
│   │   ├── favicon                         # FAVICON ICON FILES
│   │   └── icons.svg                       # ICONS FILES APPLICATION 
│   ├── src
│   │   ├── assets\styles
│   │   │   ├── main.css
│   │   │   └── variables.css
│   │   ├── components
│   │   │   ├── Map.vue
│   │   │   ├── Navbar.vue
│   │   │   └── RedirectMessage.vue
│   │   ├── pages
│   │   │   ├── Events.vue
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Profile.vue
│   │   │   ├── Refresh.vue
│   │   │   ├── Register.vue
│   │   │   ├── ReportInfo.vue
│   │   │   ├── SiteInfo.vue
│   │   │   ├── UserInfo.vue
│   │   │   └── Users.vue
│   │   ├── routes
│   │   │   └── index.js
│   │   ├── services
│   │   │   ├── Api.js
│   │   │   ├── AuthService.js
│   │   │   ├── MapService.js
│   │   │   ├── NotificationService.js
│   │   │   ├── PathService.js
│   │   │   ├── ReportService.js
│   │   │   ├── SiteService.js
│   │   │   └── UserService.js
│   │   ├── stores
│   │   │   └── authStores.js
│   │   └── utils
│   │   │   └── Validator.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── .gitignore
│   ├── index.html
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
├── Wiki                                    # WIKI WITH README IMAGES AND DELIVERABLES
│   ├── Application Images
│   └── Deliverables
├── .gitignore
├── LICENSE
├── README.md
└── swagger.yaml
</code></pre>
</div>
