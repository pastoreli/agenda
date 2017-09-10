// JavaScript Document
$(".caixa").click(function(){
	$(this).find(".txt").focus();
	

});

$(".txt").focus(function(){
	//$(this).parent().css("background", "#000");
	$(this).parent().find("label").css("margin-top", "-40px");
	$(this).parent().find("label").css("font-size", "10px");
	$(this).parent().find("label").css("color", "#f64141");
	$(this).parent().css("border-color", "#f64141");
	
	/*Cria o efeito google de ser*/
	
	$(this).parent().find("span").css("margin-left", "0px");
	$(this).parent().find("span").css("width","100%");
	$(this).parent().find("span").css("height", "3px");
	$(this).parent().find("span").css("background", "#f64141");
});

/*Retira os efeitos das Labels*/
$(".txt").blur(function(){
	/*Verifica se as caixas de textos estão vazias*/
	if($(this).val().length <= 0){
		$(this).parent().find("label").css("margin-top", "0px");
		$(this).parent().find("label").css("font-size", "14px");
		$(this).parent().css("border-color", "#e0e0e0");
		$(this).parent().find("label").css("color", "#757575");	
	
		/*Retira o efeito google de ser*/

		$(this).parent().find("span").css("margin-left", "50%");
		$(this).parent().find("span").css("width","0px");
		$(this).parent().find("span").css("height", "0px");
		$(this).parent().find("span").css("background", "#bcbcbc");
	}
});

//Criação do efeito Ripple;

var btnsRipple = function(e){
	var target = e.target;
	
	if(target.tagName.toLowerCase() !== 'button') return false;
	var rect = target.getBoundingClientRect();
	var ripple = target.querySelector('.ripple');
	
	if(!ripple){
		ripple = document.createElement('span');
		ripple.className = 'ripple';
		ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
		target.appendChild(ripple);
	}
	ripple.classList.remove('show');
	
	var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
	var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
	
	ripple.style.top = top + 'px';
	ripple.style.left = left + 'px';
	ripple.classList.add('show');
	return false;
}

document.addEventListener('click', btnsRipple, false);

/*Aqui damos início a limpeza do código usando Ajax tripla ação*/

$('#logar').click(function(){

	if(validacao()){
		alert('Login efetuado com sucesso!');
	}else{
		
	}
	
        $.ajax({
            url: 'php/configurar_login.php',
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: {
                email: $(".txt.email").val(),
                senha: $(".txt.senha").val(),
            },
             success: function (retorno) {
 				if(retorno.sucesso){
					alert('Usuário encontrado / Logado');
				}else{
					alert('Erro ao logar, usuário e/ou senha inválido');
				}
            
        },
        error: function () {
 
            alert("some problem in saving data");
        }
        })


});


function validacao(){
	var v_email, v_senha;
	
	var expemail = /^[a-zA-Z0-9][a-zA-Z0-9.-]+@([a-zA-Z0-9._-]+.)[a-zA-Z-0-9]{2,3}/;

    if(expemail.exec($(".email").val()))
        v_email = true;
    else{
        $(".email").css("background", "#ffc1d1");
        v_email = false;
    }
	
	if($(".senha").val().length <= 0){
		$(".senha").css("background", "#ffc1d1");
		v_senha = false;		
	}else{
		v_senha = true;
	}
	
	if(!v_email && !v_senha){
		return false;
	}else{
		return true;
	}
}

















