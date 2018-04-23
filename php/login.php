<?php
try {
//load composer mongo drivers
require '../vendor/autoload.php';

   $login = $_POST['login'];
   $password = $_POST['password'];

   //connect to mongodb
   $m = new MongoDB\Client("mongodb://localhost:27017");
   //echo "Connection to database successfully";
   //select a database
   $db = $m->welinkeddb;
   //echo "Database mydb selected";
   //select a collection
   $profilecol = $db->users;
   //echo "Collection selected succsessfully";

   $usercursor = $profilecol->findOne(array("login"=>$login));
   if($usercursor) {
       $userpassword=$usercursor['password'];
       if($userpassword==$password) {
           $userid = $usercursor['_id'];
                  echo json_encode(array(
                     "state" => "successfull",
                     "userid" => $userid
                  ));
       }
       //if login is correct but password is wrong
       else {
           echo json_encode(array(
              "state" => "wrongpassword"
           ));
       }
   }
   //if there is no user with this login
   else {
       echo json_encode(array(
          "state" => "wronglogin"
       ));
   }


   } catch (MongoConnectionException $e) {
      die('Error connecting to MongoDB server');
     } catch (MongoException $e) {
      die('Error: ' . $e->getMessage());
     }
?>