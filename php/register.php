<?php
try {
//load composer mongo drivers
require '../vendor/autoload.php';

   $email = $_POST['email'];
   $login = $_POST['login'];
   $password= $_POST['password'];

   //connect to mongodb
   $m = new MongoDB\Client("mongodb://localhost:27017");
   //select a database
   $db = $m->welinkeddb;
   //select a collection
   $profilecol = $db->users;

   //check if user's login or email are already used
   $logincursor = $profilecol->find(array("login"=>$login));
   $emailcursor = $profilecol->find(array("email"=>$email));
   if(count($logincursor->toArray())) {
       echo json_encode(array(
          "state" => "usedlogin"
       ));
   }
   else {
       if(count($emailcursor->toArray())) {
           echo json_encode(array(
               "state" => "usedemail"
           ));
       }
       else {
       //if email and login are free
           $user = array(
                 "email" => $email,
                 "login" => $login,
                 "password" => $password
              );
           //insert registration data to db
           $profilecol->insertOne($user);

           $insertedUserCursor = $profilecol->findOne(array("login"=>$login));
           $userid = $insertedUserCursor["_id"];

           echo json_encode(array(
               "state" => "registered",
               "userid" => $userid
           ));
       }
   }
} catch (MongoConnectionException $e) {
        die('Error connecting to MongoDB server');
       } catch (MongoException $e) {
        die('Error: ' . $e->getMessage());
       }
?>