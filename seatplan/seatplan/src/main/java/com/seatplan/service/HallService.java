package com.seatplan.service;

import com.seatplan.entity.Hall;
import com.seatplan.repository.HallRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HallService {

    private final HallRepository hallRepository;

    public HallService(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    public Hall addHall(Hall hall) {
        return hallRepository.save(hall);
    }

    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    public Optional<Hall> getHallById(Long id) {
        return hallRepository.findById(id);
    }

    public Hall updateHall(Long id, Hall hallDetails) {

        Hall hall = hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        hall.setHallName(hallDetails.getHallName());
        hall.setRowCount(hallDetails.getRowCount());
        hall.setColumnCount(hallDetails.getColumnCount());
        hall.setCapacity(hallDetails.getCapacity());

        return hallRepository.save(hall);
    }

    public void deleteHall(Long id) {

        if (!hallRepository.existsById(id)) {
            throw new RuntimeException("Hall not found");
        }

        hallRepository.deleteById(id);
    }
}