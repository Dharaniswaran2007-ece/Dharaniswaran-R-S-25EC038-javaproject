package com.seatplan.controller;

import com.seatplan.entity.ExamSession;
import com.seatplan.service.ExamSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam-sessions")
public class ExamSessionController {

    private final ExamSessionService examSessionService;

    public ExamSessionController(
            ExamSessionService examSessionService) {

        this.examSessionService = examSessionService;
    }

    @PostMapping
    public ExamSession addExamSession(
            @RequestBody ExamSession examSession) {

        return examSessionService.addExamSession(examSession);
    }

    @GetMapping
    public List<ExamSession> getAllExamSessions() {
        return examSessionService.getAllExamSessions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamSession> getExamSessionById(
            @PathVariable Long id) {

        return examSessionService.getExamSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ExamSession updateExamSession(
            @PathVariable Long id,
            @RequestBody ExamSession examSession) {

        return examSessionService.updateExamSession(
                id, examSession);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExamSession(
            @PathVariable Long id) {

        examSessionService.deleteExamSession(id);

        return ResponseEntity.ok(
                "Exam session deleted successfully");
    }
}