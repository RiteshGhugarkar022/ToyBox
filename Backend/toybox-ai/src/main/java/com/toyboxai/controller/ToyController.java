package com.toyboxai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toyboxai.model.Toy;
import com.toyboxai.service.ToyService;

@RestController
@RequestMapping("/api/toys")
@CrossOrigin
public class ToyController {

    @Autowired ToyService service;

    @GetMapping
    public List<Toy> getAll() {
        return service.getAllToys();
    }

    @PostMapping("/admin")
    public Toy add(@RequestBody Toy toy) {
        return service.addToy(toy);
    }

    @PutMapping("/admin/{id}")
    public Toy update(@PathVariable Long id, @RequestBody Toy toy) {
        return service.updateToy(id, toy);
    }

    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteToy(id);
    }
}