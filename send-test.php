<?php 
$number = "6281532380661";
$messages = "API";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "localhost:8000/send");
    curl_setopt($ch, CURLOPT_POST, 1);


    // $post = [
    //     'number' => '6281532380661',
    //     'message' => 'API'
    // ];
    // curl_setopt(
    //     $ch,
    //     CURLOPT_POSTFIELDS,
    //     $post
    // );
    curl_setopt(
        $ch,
        CURLOPT_POSTFIELDS,
        "number=" . $number."&message=" . $messages
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));



    //return the transfer as a string 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);


    $output = curl_exec($ch);

    curl_close($ch);

echo ($ch);
