package com.seatplan.repository;

import com.seatplan.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByHallIdAndExamSessionId(
            Long hallId,
            Long examSessionId
    );

    List<Seat> findByStudentIdAndExamSessionId(
            Long studentId,
            Long examSessionId
    );

    List<Seat> findByStudent_Id(Long studentId);

    void deleteByHallIdAndExamSessionId(
            Long hallId,
            Long examSessionId
    );
}