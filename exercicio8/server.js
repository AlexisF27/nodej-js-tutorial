const exp = require('constants');
const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const PORT = process.env.PORT || 3500;



//NOTE:Hay 3 tipos de middleware, built in middleware, custom middleware and middleare from third parties 

//NOTE: built-in middleware to handle unlencoded data 
    // in other words, form data:
    // 'content-type: aplication/x-www-from-unlencoded'
    //'use' se utiliza para se aplica middleware todas las rutas que entran  
    //basicamente esto se utiliza para obtener data cuando form data es submetido 


//NOTE: custom middleware logger, es para que se lea primero
    //cuando se crea custom middleware se necesita poner el next
    //en cambio en los built in ya esta previsto que lo tenga 
app.use(logger);

// Cross Origin Resoruce Sharing -- middleware from third parties
const whiteList = ['https://www.yoursite.com', 'http://localhost:3500'];
const corsOption = {
  origin: (origin, callback) => {
    //!origin condition only  during development, after we can take it out 
    if (whiteList.indexOf(origin) !== -1 || !origin){
      callback(null, true);
    } else {
      callback(new Error(' not allowed by CORS'))
    }
  }, 
  optionSuccessSTatus:200
}
app.use(cors(corsOption));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
//esta linha de codigo permite que se carguen el css en la carpeta publics antes de cualque pedido entre 
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));






app.get('/*', (request, response) => {
  response.status(404).sendFile(path.join(__dirname, 'views', '404.html')); //302 by default 
});





app.all('/*', (request, response) => {
  response.status(404);
  if(request.accepts('html')){
    response.sendFile(path.join(__dirname, 'views', '404.html')); //302 by default 
  }else if(request.accepts('json')){
    response.json({ error: "404 Not Found"}); //302 by default 
  }else {
    response.type('txt').send("404 Not Found");
  }
});

app.get('/*')

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`)); 

