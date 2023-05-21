<?php
// This example sets up an endpoint using the Slim framework.
// Watch this video to get started: https://youtu.be/sGcNPFX1Ph4.
require_once 'dbConnection.php';
require 'vendor/autoload.php';
use GuzzleHttp\Client;
use Slim\Http\Request;
use Slim\Http\Response;
use Stripe\Stripe;





$c = new \Slim\Container();
$c['errorHandler'] = function ($c) {
    return function ($request, $response, $exception) use ($c) {

        // echo $exception->errorInfo[2];
        return $response->withRedirect("http://localhost:3000?error=you cannot place multiple orders on same offer");
   
    };

};



// $c['errorHandler'] = function ($c) {
//     return function ($request, $response, $exception) use ($c) {
//         return $response->withStatus(500)
//             ->withHeader('Content-Type', 'text/html')
//             ->write('Something went wrong!');
//     };
// };



$app = new \Slim\App($c);


error_reporting(E_ALL);
set_error_handler(function ($severity, $message, $file, $line) {
    if (error_reporting() & $severity) {
        throw new \ErrorException($message, 0, $severity, $file, $line);
    }
});

$client = new Client([
  // Base URI is used with relative requests
  'base_uri' => 'http://localhost:5000',
  // You can set any number of default request options.
  'timeout' => 2.0,
]);

$stripe = new \Stripe\StripeClient('sk_test_R10Qnz7v0YC19OD7v54ve3UO00A3dxDiHU');


$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With,X-Auth-Token, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');


        
});

$app->add(function ($request, $response, $next) {
    // Set your secret key. Remember to switch to your live secret key in production!
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    \Stripe\Stripe::setApiKey('sk_test_R10Qnz7v0YC19OD7v54ve3UO00A3dxDiHU');

    return $next($request, $response);
});

$app->get('/', function (Request $request, Response $response) {

    return $response->withStatus(200);

});

$app->get('/get-payment-details', function (Request $request, Response $response) {

    $id = $request->getQueryParam('id');
    $data = $stripe->paymentIntents->retrieve($id,[]);
    return $response->withJson([$data])->withStatus(200);
});


$app->get('/get-session-details', function (Request $request, Response $response) {

  $stripe = new \Stripe\StripeClient('sk_test_R10Qnz7v0YC19OD7v54ve3UO00A3dxDiHU');

    $id = $request->getQueryParam('id');
    $sessionID = $request->getQueryParam('paysessionID');
    $data = $stripe->checkout->sessions->retrieve($id,[]);
    $payment_ID=$data->payment_intent;
    $data = $stripe->paymentIntents->retrieve($payment_ID,[]);


    $amount_from_card=$data->amount;
    $capture_method=$data->capture_method;
    $amount_refunded=$data->charges->data[0]->amount_refunded;
    $balance_transaction=$data->charges->data[0]->balance_transaction;
    $country=$data->charges->data[0]->billing_details->address->country;

    $calculated_statement_descriptor=$data->charges->data[0]->calculated_statement_descriptor;

    $captured=$data->charges->data[0]->captured;
    $created=$data->charges->data[0]->created;
    $currency=$data->charges->data[0]->currency;
    $customer=$data->charges->data[0]->customer;
    $paid=$data->charges->data[0]->paid;
    $status=$data->charges->data[0]->status;
    $payment_type=$data->payment_method_types[0];
    


    $client = new Client(['base_uri' => 'http://localhost:5000','timeout' => 2.0]);
    $token = $request->getHeader('x-auth-token');
    $r = $client->request('POST', 'http://localhost:5000/api/service/get-session-data-users', [
      'form_params' =>['sessionID' => $sessionID]
    ]);
    $resData = json_decode($r->getBody())->data;

     $sellerUsername=$resData->seller;
     $buyerUsername=$resData->buyer;
     $serviceID=$resData->serviceID;
     $offerID=$resData->offerId; // we will use as order id
     $DeliveryTime=$resData->DeliveryTime; // we will use as order id
     $amount=$resData->amount; // we will use as order id

  
     $db= getConnection();


      


      $sql="insert into order_details(order_id,seller_username,buyer_username,order_datetime,payment_id,service_id,status) values('$offerID','".$sellerUsername."','".$buyerUsername."',now(),'".$payment_ID."','".$serviceID."','active')";
    
      $results= $db->query($sql);

      $sql="insert into order_updation_stack(order_id,order_status,remarks,initiated_by,delivery_time,update_datetime) values('$offerID','started','order is just placed by $buyerUsername','buyer','$DeliveryTime',now())";
     // echo $sql;
       $results= $db->query($sql);
      $body = ["sessionID" => $request->getQueryParam('id')];
      $token = $request->getHeader('x-auth-token');
      $r = $client->request('POST', 'http://localhost:5000/api/chatapp/offer-accept', [
          'form_params' => $body,
          'headers' => [
              "x-auth-token" => $token,
          ],
      ]);
  
    //   print_r(json_decode($r->getBody()));
    //   $resData = json_decode()->data;

    $sql="select id from users where username='$buyerUsername'";
    $results= $db->query($sql);



    $data=$results->fetch(PDO::FETCH_OBJ); 

    $amount_from_personal_balance=0;

    $userID=$data->id;
    $orderID=$offerID;;


    // // echo  $amount_from_card;

   
    $values="values ('".$payment_ID."','".$amount_from_card."','".$capture_method."','".$amount_from_personal_balance."','".$amount_refunded."','".$balance_transaction."','".$country."','".$calculated_statement_descriptor."','".$captured."','".$created."','".$currency."','".$customer."','".$paid."','".$orderID."','".$userID."','".$payment_type."')";





    $sql="INSERT INTO `payment_details`(`payment_id`, `amount_from_card`, `captured_method`, `amount_from_personal_balance`, `amount_refunded`, `balance_transation`, `country`, `calculated_statement_descriptor`, `captured`, `created`, `currency`, `customer`, `paid`, `order_id`, `user_id`, `payment_type`) ".$values;
 
    // // echo $sql;

     $db->query($sql);

    //     // print_r($data);



    return $response->withJson($resData)->withStatus(200);
    // return $response->withJson($data)->withStatus(200);
});



$app->post('/create-checkout-session', function (Request $request, Response $response) {


    $body = ["sessionID" => $request->getQueryParam('id')];

    $client = new Client(['base_uri' => 'http://localhost:5000','timeout' => 2.0]);
    $token = $request->getHeader('x-auth-token');
    $r = $client->request('POST', 'http://localhost:5000/api/service/get-session-data', [
        'form_params' => $body,
        'headers' => [
            "x-auth-token" => $token,
        ],
    ]);

    $resData = json_decode($r->getBody())->data;
    $title=$resData->title;
    $amount=$resData->remaining * 100;
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => $title,
                ],
                'unit_amount' => $amount ,
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost:2000/get-session-details?id={CHECKOUT_SESSION_ID}&paysessionID='.$request->getQueryParam('id'),
        'cancel_url' => 'https://example.com/cancel',
    ]);

    return $response->withJson(['id' => $session->id])->withStatus(200);


});



$app->run();
