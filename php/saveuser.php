<?php
try {
//load composer mongo drivers
require '../vendor/autoload.php';

   $userid = $_POST['userid'];
   $male = $_POST['male'];
   $dob = $_POST['dob'];
   $country = $_POST['country'];
   $city = $_POST['city'];

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
   $arr = array(
      "_id"=>$usercursor["_id"],
      "email"=>$usercursor["email"],
      "login"=>$usercursor["login"],
      "password"=>$usercursor["password"],
      "male"=>$male,
      "dob"=>$dob,
      "address"=>array(
         "country"=>$country,
         "city"=>$city
      ),
   );

$profilecol->deleteOne(array("_id"=>new MongoDB\BSON\ObjectID($userid)), array('safe'=>true));
$profilecol->insertOne($arr);
   //$profilecol->save($arr);

   echo 'changes saved';
   } catch (MongoConnectionException $e) {
      die('Error connecting to MongoDB server');
     } catch (MongoException $e) {
      die('Error: ' . $e->getMessage());
     }
?>