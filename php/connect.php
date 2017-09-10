<?php
@$con = mysql_connect('localhost', 'root', '');

mysql_select_db('db_agenda', $con);

mysql_query("SET NAMES utf8");

?>