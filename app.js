var mongoose= require ("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test-todo-Db');

var bola= new mongooose.Schema();

var User = mongoose.model('user', {
  name :{
    type: String,
    required: true,
    minlength: 1,
    trin: true
  }
})

//trim: true this hellps to removeand validate whitespaces
var TodoScheme = mongoose.model('Todo', bola);

var newTodo = new TodoScheme({text: 'Cook fish'});
var bolanle = new TodoScheme({text: 'cooker rice', completed: true, completedAt: 73543875697386050});

//newTodo.save().then(doc=>console.log('done',doc ))
//.catch(e=>console.log(e))
bolanle.save().then(doc=>console.log('done',doc ))
.catch(e=>console.log(e))

