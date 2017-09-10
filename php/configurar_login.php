<?php
include('connect.php');
$email = $_POST['email'];
$senha = $_POST['senha'];
$sql = mysql_query("SELECT * FROM `db_agenda`.`tb_usuario` WHERE email = '$email' AND senha = '$senha'") or die ("Erro ao Buscar");
	
	if(mysql_num_rows($sql)<=0){
		echo json_encode(array('sucesso'=> false));
		
	}else{
		echo json_encode(array('sucesso'=> true));
	}


?>