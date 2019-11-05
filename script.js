var url = "https://www.jsonstore.io/7ed732e4c3f28db6070f2109f184c4543dd03def9a5779c831af9357f2a98c2e";
var users = [{un:"Junhao",pw:"Zhang",sc:6969}];
$('.sgnup').click(function(){
  var username = $('.sgnusername').val();
  var password = $('.sgnuppasswrd').val();
  var welcometxt = $('.sgnupcode').val();
  if(username.replace(/\ /gi,"") != "" && password.replace(/\ /gi,"") != ""){
    axios.get(url).then(function(data){
      console.log(data);
      var users = data.data.result;
      var isused = false;
      for(var i = 0; i < users.length; i ++){
        if(users[i].un.toLowerCase() == username.toLowerCase()){
          alert("Username already taken");
          isused = true;
          break;
        }
      }
      if(!isused){
        users.push({un:username,pw:password,sc:0});
        axios.post(url, {
          users
        }).then(function(data){console.log(data);});
      $('.tobekilled').html("Successfully signed up! Credentials are: <br>Username: <code>"+username+"</code><br>Password: <code>"+password+"</code><br>Remember this!");
        localStorage.setItem('uspas', {username:username,password:password});
      }
    }).catch(function(err){console.log(err);});
  }else{
    console.log("a");
    alert("Enter text first!");
  }
});
$('.login').click(function(){
  var username = $('.username').val();
  var password = $('.password').val();
  if(username != "" && password != ""){
    axios.get(url).then(function(data){
      var users = data.data.result;
      console.log(users);
      var score = "";
      for(var i = 0; i < users.length; i ++){
        if(users[i].pw == password.toLowerCase() && users[i].un.toLowerCase() == username.toLowerCase()){
          score = users[i].sc;
          $('.tobekilled').html("Welcome "+users[i].un+"! Your score is: "+score);
          localStorage.setItem('uspas', JSON.stringify({username:users[i].un,password:users[i].pw}));
          //alert(JSON.parse(localStorage.getItem('uspas')))
          break;
        }
        $('.tobekilled').html("Couldn't find account. Maybe you forgot something?");
      }
    }).catch(function(err){console.log(err);});
  }else{
    console.log("a");
    alert("Enter text first!");
  }
});

function addto(score){
  var a = localStorage.getItem('uspas');
  var b = JSON.parse(a);
  axios.get(url).then(function(data){
    var users = data.data.result;
      for(var i = 0; i < users.length; i ++){
        if(users[i].pw == b.password && users[i].un.toLowerCase() == b.username.toLowerCase()){
          users[i].sc+=score;
        }
      }
    axios.post(url,users);
  })
}
function initgame(qcont,questions,answer,btn,score){
  var game = {
    questions:questions,
    answer:answer,
    btn:btn,
    score:score,
    s:0,
    qcont:qcont
  };
  with(game){
    var ques = questions[Math.floor(Math.random()*questions.length)];
    qcont.html(ques.q);
    score.html(s);
    btn.click(function(){
      if(answer.val()==ques.a){
        s++;
        score.html(s);
        addto(1);
      }else if(answer.val().toLowerCase().replace(/\ /g,"")==ques.a.toString().toLowerCase().replace(/\ /g,"")){
        s++;
        score.html(s);
        addto(1);
      }else{
        console.log("");
        s=0;
        score.html(s);
        alert("You were wrong, the correct answer is "+ques.a);
        addto(-1);
      }
      ques = questions[Math.floor(Math.random()*questions.length)];
      qcont.html(ques.q);
      answer.val("");
    });
    answer.keypress(function(e){
      if(e.which==13){
        btn.trigger("click");
      }
    });
  }
}