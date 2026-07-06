package com.toyboxai.controller;

import com.toyboxai.model.Order;
import com.toyboxai.model.OrderItem;
import com.toyboxai.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import com.toyboxai.repository.UserRepository;
import com.toyboxai.model.User;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/checkout")
    public Order createOrder(@RequestBody Order order) {
        order.setDate(LocalDateTime.now());
        order.setStatus("Pending");
        
        try {
            if (order.getCustomer() != null && order.getCustomer().getLoginId() != null) {
                 User realUser = userRepository.findFirstByLoginId(order.getCustomer().getLoginId()).orElse(null);
                 order.setCustomer(realUser);
            }
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    item.setOrder(order);
                }
            }
            return orderRepository.save(order);
        } catch (Exception e) {
            String ex = e.toString() + " | Cause: " + (e.getCause() != null ? e.getCause().toString() : "none");
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, ex);
        }
    }

    @PostMapping("/checkout-debug")
    public org.springframework.http.ResponseEntity<String> debugOrder(@RequestBody Order order) {
        order.setDate(LocalDateTime.now());
        order.setStatus("Pending");
        try {
            if (order.getCustomer() != null && order.getCustomer().getLoginId() != null) {
                 User realUser = userRepository.findFirstByLoginId(order.getCustomer().getLoginId()).orElse(null);
                 order.setCustomer(realUser);
            }
            orderRepository.save(order);
            return org.springframework.http.ResponseEntity.ok("OK");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body(e.toString() + " | Cause: " + (e.getCause() != null ? e.getCause().toString() : "none"));
        }
    }

    @GetMapping("/customer/{loginId}")
    public java.util.List<Order> getCustomerOrders(@PathVariable String loginId) {
        return orderRepository.findByCustomer_LoginId(loginId);
    }

    @GetMapping("/admin")
    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/customer/{id}/rating")
    public Order updateOrderRating(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body) {
        Order optOrder = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        optOrder.setRating(body.get("rating"));
        return orderRepository.save(optOrder);
    }

    @PutMapping("/admin/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Order optOrder = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        optOrder.setStatus(body.get("status"));
        return orderRepository.save(optOrder);
    }
}
