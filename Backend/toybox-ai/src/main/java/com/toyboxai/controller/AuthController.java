package com.toyboxai.controller;

import com.toyboxai.model.User;
import com.toyboxai.repository.UserRepository;
import com.toyboxai.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired UserRepository repo;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("CUSTOMER");
        repo.save(user);
        return "Registered";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User u = repo.findFirstByLoginId(user.getLoginId()).orElseThrow();
        if (encoder.matches(user.getPassword(), u.getPassword())) {
            return jwtUtil.generateToken(u.getLoginId());
        }
        throw new RuntimeException("Invalid login");
    }

    @GetMapping("/user/{loginId}")
    public User getUserProfile(@PathVariable String loginId) {
        return repo.findFirstByLoginId(loginId).orElseThrow(() -> new RuntimeException("User not found"));
    }
}