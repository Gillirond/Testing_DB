<?php
try {
//load composer mongo drivers
require '../vendor/autoload.php';

   $size = $_POST['size'];
   $userid = $_POST['userid'];

   //connect to mongodb
   $m = new MongoDB\Client("mongodb://localhost:27017");
   //echo "Connection to database successfully";
   //select a database
   $db = $m->welinkeddb;
   //echo "Database mydb selected";
   //select a collection
   $profilecol = $db->users;
   //echo "Collection selected succsessfully";

   $usercursor = $profilecol->findOne(array("_id"=>new MongoDB\BSON\ObjectID($userid)));
   if($size=="full") {
       echo json_encode(iterator_to_array($usercursor));
   }
   if($size=="cut") {
       echo json_encode(array(
          "login" => $usercursor['login']
       ));
   }


   } catch (MongoConnectionException $e) {
      die('Error connecting to MongoDB server');
     } catch (MongoException $e) {
      die('Error: ' . $e->getMessage());
     }
?>