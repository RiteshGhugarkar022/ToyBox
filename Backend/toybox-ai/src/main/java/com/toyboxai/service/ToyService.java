package com.toyboxai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.toyboxai.model.Toy;
import com.toyboxai.repository.ToyRepository;

@Service
public class ToyService {

    @Autowired
    private ToyRepository repo;

    public List<Toy> getAllToys() {
        return repo.findAll();
    }

    public Toy addToy(Toy toy) {
        return repo.save(toy);
    }

    public Toy updateToy(Long id, Toy toyData) {
        return repo.findById(id).map(existing -> {
            existing.setName(toyData.getName());
            existing.setPrice(toyData.getPrice());
            existing.setDescription(toyData.getDescription());
            existing.setRatings(toyData.getRatings());
            existing.setStock(toyData.getStock());
            existing.setCategory(toyData.getCategory());
            existing.setToyImage(toyData.getToyImage());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Toy not found"));
    }

    public void deleteToy(Long id) {
        repo.deleteById(id);
    }
}