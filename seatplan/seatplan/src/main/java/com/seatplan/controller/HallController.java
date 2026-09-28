package com.seatplan.controller;

import com.seatplan.entity.Hall;
import com.seatplan.service.HallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/halls")
public class HallController {

    private final HallService hallService;

    public HallController(HallService hallService) {
        this.hallService = hallService;
    }

    @PostMapping
    public Hall addHall(@RequestBody Hall hall) {
        return hallService.addHall(hall);
    }

    @GetMapping
    public List<Hall> getAllHalls() {
        return hallService.getAllHalls();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable Long id) {

        return hallService.getHallById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Hall updateHall(
            @PathVariable Long id,
            @RequestBody Hall hall) {

        return hallService.updateHall(id, hall);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHall(@PathVariable Long id) {

        hallService.deleteHall(id);

        return ResponseEntity.ok("Hall deleted successfully");
    }
}