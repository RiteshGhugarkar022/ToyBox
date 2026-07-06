package com.toyboxai.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.toyboxai.model.Toy;
import com.toyboxai.repository.ToyRepository;

@Service
public class ChatService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Autowired
    private ToyRepository toyRepository;

    public String askAI(String message) {
        List<Toy> allToys = toyRepository.findAll();
        
        StringBuilder contextBuilder = new StringBuilder("Welcome to ToyBox-AI, your premium online toy store! We offer toys across various categories including Educational, Vehicles, Soft Toys, Building, Puzzles, Dolls, Action, Creative, Music, Roleplay, and Collectibles. Here is our current inventory:\\n");
        for(Toy t : allToys) {
            contextBuilder.append("- ").append(t.getName())
                          .append(" (Category: ").append(t.getCategory())
                          .append(", Price: Rs. ").append(t.getPrice())
                          .append(", Stock: ").append(t.getStock())
                          .append(") - ").append(t.getDescription()).append("\\n");
        }
        String context = contextBuilder.toString();

        try {
            // Using a free, open AI endpoint! No API key needed!
            String url = "https://text.pollinations.ai/openai";
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String escapedContext = context.replace("\"", "\\\"").replace("\n", "\\n");
            String escapedMessage = message.replace("\"", "\\\"").replace("\n", "\\n");
            
            String body = "{"
               + "\"model\": \"openai\","
               + "\"messages\": ["
               + "  {\"role\": \"system\", \"content\": \"You are a helpful, enthusiastic toy shopping assistant for ToyBox-AI. Keep your answers brief but accurate. Use the following context about our store and inventory to answer user queries accurately: " + escapedContext + "\"},"
               + "  {\"role\": \"user\", \"content\": \"" + escapedMessage + "\"}"
               + "]"
               + "}";
            
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = rest.postForEntity(url, entity, Map.class);
            Map choice = (Map)((List)response.getBody().get("choices")).get(0);
            Map msg = (Map)choice.get("message");
            return msg.get("content").toString();
        } catch (Exception e) {
            System.out.println("Pollinations API failed: " + e.getMessage());
            return generateLocalResponse(message.toLowerCase(), allToys);
        }
    }
    
    private String generateLocalResponse(String query, List<Toy> toys) {
        if (query.contains("hi") || query.contains("hello") || query.contains("hey")) {
             return "Hi there! I am the ToyBox AI Assistant. I can help you find toys by price, category, or give you information about our website. What are you looking for today?";
        }

        if (query.contains("about") || query.contains("website") || query.contains("who are you")) {
            return "I am the ToyBox-AI assistant! We are a premium online store offering a wide variety of toys including educational toys, action figures, puzzles, and more. Our toys range from Rs. 9.99 to Rs. 450.00.";
        }
        
        if (query.contains("price") || query.contains("cheap") || query.contains("affordable") || query.contains("under") || query.contains("cost")) {
            List<Toy> affordable = toys.stream().filter(t -> t.getPrice() < 50).collect(Collectors.toList());
            if (!affordable.isEmpty()) {
                return "If you are looking by price, we have some great affordable options like the " + affordable.get(0).getName() + " for Rs. " + affordable.get(0).getPrice() + " or the " + (affordable.size() > 1 ? affordable.get(1).getName() : affordable.get(0).getName()) + " for Rs. " + (affordable.size() > 1 ? affordable.get(1).getPrice() : affordable.get(0).getPrice()) + ".";
            }
        }
        
        String[] categories = {"educational", "vehicles", "soft toys", "building", "puzzles", "dolls", "action", "creative", "music", "roleplay", "collectibles"};
        for (String cat : categories) {
            if (query.contains(cat)) {
                List<Toy> catToys = toys.stream().filter(t -> t.getCategory() != null && t.getCategory().toLowerCase().contains(cat)).collect(Collectors.toList());
                if (!catToys.isEmpty()) {
                    StringBuilder sb = new StringBuilder("We have some great " + cat + " toys! For example: ");
                    for(int i=0; i<Math.min(3, catToys.size()); i++) {
                        sb.append(catToys.get(i).getName()).append(" (Rs. ").append(catToys.get(i).getPrice()).append(")");
                        if (i < Math.min(3, catToys.size()) - 1) sb.append(", ");
                    }
                    sb.append(".");
                    return sb.toString();
                }
            }
        }
        
        if (query.contains("order") || query.contains("buy") || query.contains("purchase") || query.contains("step")) {
             return "To order a toy, simply browse our catalog on the Toys page, click 'Order / Add to Cart' for the items you like, navigate to your Cart, and click 'Proceed to Checkout'. You can then pay securely using our payment gateway!";
        }
        
        if (query.contains("payment") || query.contains("pay") || query.contains("razorpay") || query.contains("phonepe")) {
             return "We support secure payments via PhonePe, Razorpay, and UPI. When you checkout from your cart, you'll be shown a QR code to complete your transaction.";
        }
        
        if (query.contains("shipping") || query.contains("delivery") || query.contains("track")) {
             return "We offer fast and reliable shipping! You can track your order status directly from your Customer Dashboard once the order is placed.";
        }
        
        if (query.contains("refund") || query.contains("return")) {
             return "If you are not satisfied with your toy, you can request a return within 14 days of delivery by contacting our support team.";
        }
        
        if (query.contains("suggest") || query.contains("recommend") || query.contains("help")) {
             if(toys.size() > 1) {
                 return "I highly recommend the " + toys.get(0).getName() + " which costs Rs. " + toys.get(0).getPrice() + ". It's one of our best sellers! We also have the " + toys.get(1).getName() + "!";
             }
        }
        
        return "I'm your friendly ToyBox AI Assistant! I can help you find toys by category (e.g. 'educational', 'action') or by price. Feel free to ask about our catalog!";
    }
}