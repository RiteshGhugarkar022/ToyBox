package com.toyboxai.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @PostMapping
    public String pay() {
        return "Payment Successful";
    }
}