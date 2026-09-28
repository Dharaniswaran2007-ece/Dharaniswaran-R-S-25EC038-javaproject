package com.seatplan.controller;

import com.seatplan.entity.Seat;
import com.seatplan.repository.SeatRepository;
import com.seatplan.service.SeatingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seating")
public class SeatingController {

    private final SeatingService seatingService;
    private final SeatRepository seatRepository;

    public SeatingController(SeatingService seatingService,
                             SeatRepository seatRepository) {

        this.seatingService = seatingService;
        this.seatRepository = seatRepository;
    }

    // Generate seating plan
    @PostMapping("/generate/{sessionId}/{hallId}")
    public List<Seat> generateSeating(
            @PathVariable Long sessionId,
            @PathVariable Long hallId) {

        return seatingService.generateSeating(sessionId, hallId);
    }

    // View seating plan for a hall and exam session
    @GetMapping("/hall/{hallId}/session/{sessionId}")
    public List<Seat> getSeatingPlan(
            @PathVariable Long hallId,
            @PathVariable Long sessionId) {

        return seatRepository.findByHallIdAndExamSessionId(
                hallId,
                sessionId
        );
    }
    @GetMapping("/student/{registerNumber}")
    public List<Seat> findStudentSeat(
            @PathVariable String registerNumber) {

        return seatingService.findStudentSeats(
                registerNumber
        );
    }
}