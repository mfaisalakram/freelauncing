<?php 

function getConnection() {
    $dbhost="us-cdbr-east-02.cleardb.com";
    $dbuser="b23e4d503703fb";
    $dbpass="6ab3e370";
    $dbname="heroku_80ce74c8036a1fb";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
    }

?>