

(function() {
// 初始化Parse SDK()跟parse連在一起
Parse.initialize("jjVNb0LFUEAP0TPVTpJM53HntiO8okzhepNLvOPp","Og4t2M3680IHqjaVjI6Hs0rYXK9len6NSTDO0nPY");

	var temp = {};
	["loginView","evaluationView","updateSuccessView","scoreView"].forEach(function(l){
		// 將template編譯
		templateCode=document.getElementById(l).text;
		temp[l]=doT.template(templateCode)

	});

	// 各個view相對應的處理函數 navbar indexView loginView evaluationView scoreView
	var process = {

		navbar:function() {
			var NowUsr = Parse.User.current();
			if (NowUsr) { // login 
				document.getElementById("loginButton").style.display="none";
				document.getElementById("logoutButton").style.display="block";
				document.getElementById("evaluationButton").style.display="block";
				document.getElementById("scoreButton").style.display="block";

			}
			else { // no login
				document.getElementById("loginButton").style.display="block";
				document.getElementById("logoutButton").style.display="none";
				document.getElementById("evaluationButton").style.display="none";
				document.getElementById("scoreButton").style.display="none";

			}
			document.getElementById("logoutButton").addEventListener("click",function() {
				Parse.User.logOut();
				process.navbar();
				window.location.hash="login/"
			})
		},

		// 首頁
		indexView: function() {
		  var NowUsr = Parse.User.current();
	      if(NowUsr) {
	        window.location.hash = "peer-evaluation/"
	      } // login 
	      else{
	        window.location.hash = "login/"
	      } // no login
	    },

		
		loginView:function(t){
		var check = true;

		 var NowUsr = Parse.User.current();
	      if(NowUsr) {
	      	    window.location.hash = 'peer-evaluation/';
	      	          } 

	     else {
        document.getElementById('content').innerHTML = temp.loginView();}


			document.getElementById("content").innerHTML=temp.loginView();
			document.getElementById("form-signin-student-id").addEventListener("keyup",function(){
			
			if ( TAHelp.getMemberlistOf(document.getElementById("form-signin-student-id").value)  === false ) 
			
 			{ 
				document.getElementById("form-signin-message").innerHTML="你好，新來的！"
				document.getElementById("form-signin-message").style.display="block"
			}
			else{
				document.getElementById("form-signin-message").style.display="block"
				document.getElementById("form-signin-message").innerHTML="歡迎！" + document.getElementById("form-signin-student-id").value + " : )"

			}
		
			})			

			////////////////////////////////////////////////////////////////
	
			var comparePass = function(){
				var p1=document.getElementById("form-signup-password");
				var p2=document.getElementById("form-signup-password1");
				var result = p1.value === p2.value?true:false;

			if (!result) 
 			{ 
				document.getElementById("form-signup-message").innerHTML="打錯惹"
				document.getElementById("form-signup-message").style.display="block"
				check = false;

			}
			else{
				document.getElementById("form-signup-message").style.display="none"
				check = true;
			}

				console.log(result);
				return result
				};

			

			document.getElementById("form-signup-student-id").addEventListener("keyup",function(){

				if ( TAHelp.getMemberlistOf(document.getElementById("form-signup-student-id").value)  === false) 
				
					{ 
					document.getElementById("form-signup-message").innerHTML="你不是這班的唷走錯了"
					document.getElementById("form-signup-message").style.display="block"
				}
				else{
					document.getElementById("form-signup-message").style.display="none"

				}

			});

			document.getElementById("form-signup-password1").addEventListener("keyup",comparePass);
				
			 // signin  submit
	        document.getElementById('form-signin').addEventListener('submit', function(){
	          Parse.User.logIn(document.getElementById('form-signin-student-id').value,
	              document.getElementById('form-signin-password').value, {
	            success: function(user) {
	              process.navbar();
	        window.location.hash = 'peer-evaluation/';
	        process.evaluation();
	            },
	            error: function(user, error) {
	              document.getElementById('form-signin-message').style.display = 'block';     
	              document.getElementById('form-signin-message').innerHTML = "你亂打＝口＝";
	            }
	          }); 

	     
	        });

	        // signup  submit
	        document.getElementById('form-signup').addEventListener('submit', function(){

	          var student_id = document.getElementById('form-signup-student-id').value;
		      if(!TAHelp._isMemberOf(student_id)){
		        alert('你亂打＝口＝');
		        window.location.hash = '';
		      }

			var p1=document.getElementById("form-signup-password");
				var p2=document.getElementById("form-signup-password1");
				var result = p1.value === p2.value?true:false;


console.log(p1.value);
console.log(p2.value);

			if (p1.value !== p2.value) 
 			{ 
      			  window.location.hash = 'login/';
		        alert('打錯了！');


				check = false;

			}
			else{
				check = true;
				console.log(result);

	          var user = new Parse.User();
	          user.set("username", document.getElementById('form-signup-student-id').value);
	          user.set("password", document.getElementById('form-signup-password').value);
	          user.set("email", document.getElementById('form-signup-email').value);
	 
	          user.signUp(null, {
	            success: function(user) {
	               process.navbar();
			       window.location.hash = 'peer-evaluation/';
			       process.evaluation();
			    },
	            error: function(user, error) {
	              // Show the error message somewhere and let the user try again.
	              document.getElementById('form-signup-message').style.display = 'block';     
	              document.getElementById('form-signup-message').innerHTML = error.message;
	            }
	          });

	      }


        });


		},
	

		evaluationView: function(){
			var t=Parse.Object.extend("evaluation");
			var NowUsr=Parse.User.current();
			var access=new Parse.ACL;
			var item = new Parse.Query(t);


			access.setPublicReadAccess(false);
			access.setPublicWriteAccess(false);
			access.setReadAccess(NowUsr,true);
			access.setWriteAccess(NowUsr,true);

			item.equalTo("user",NowUsr);
			item.first( // 找到
				{
					success:function(i){
					window.EVAL=i;
					if(i===undefined){ // 第一次來
						console.log(NowUsr);

						var s=TAHelp.getMemberlistOf(NowUsr.get("username")).filter(function(e){
							return e.StudentId!==NowUsr.get("username")?true:false}).map(function(e)
							{
							e.scores=["0","0","0","0"];
							return e // @@
						})
						console.log(typeof(s));

					}
					else{
						var s = i.toJSON().evaluations
					}

					document.getElementById("content").innerHTML=temp.evaluationView(s); // present 
					document.getElementById("evaluationForm-submit").value=i === undefined?"送出表單":"修改表單";
					document.getElementById("evaluationForm").addEventListener("submit",function(){
						
						for(var student=0;student<s.length;student++){
							for(var u=0;u<s[student].scores.length;u++){
								var a=document.getElementById("stu"+s[student].StudentId+"-q"+u); // in html
								var f=a.options[a.selectedIndex].value;
								s[student].scores[u]=f
							}
						}

						if(i === undefined){
							i = new t;
							i.set("user",NowUsr);
							i.setACL(access)
						}
						console.log(s);
						i.set("evaluations",s);
						i.save(null, {
							success:function(){
							document.getElementById("content").innerHTML=temp.updateSuccessView()
							},error:function(){}})},false)
				},
				error:function(e){}})
		},
	// } ;

	scoreView: function(){
	  var Score = Parse.Object.extend("evaluation");
      var query = new Parse.Query(Score);


         
              document.getElementById("content").innerHTML = "AAA";
          
    },
  };

	// 設定router及相對應的處理函數
	var router = Parse.Router.extend({
		routes:{
			"":"indexView",
			"peer-evaluation/":"evaluationView",
			"login/*redirect":"loginView",
			"all-score/":"scoreView"
		},
		indexView:process.indexView,
		evaluationView:process.evaluationView,
		loginView:process.loginView,
		scoreView:process.scoreView
	});
	// 初始化整個app
	this.Router = new router;
	Parse.history.start();
	process.navbar()

})();
