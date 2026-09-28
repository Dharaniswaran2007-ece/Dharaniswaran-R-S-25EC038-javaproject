package com.seatplan.service;

import com.seatplan.entity.ExamSession;
import com.seatplan.repository.ExamSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamSessionService {

    private final ExamSessionRepository examSessionRepository;

    public ExamSessionService(ExamSessionRepository examSessionRepository) {
        this.examSessionRepository = examSessionRepository;
    }

    public ExamSession addExamSession(ExamSession examSession) {
        return examSessionRepository.save(examSession);
    }

    public List<ExamSession> getAllExamSessions() {
        return examSessionRepository.findAll();
    }

    public Optional<ExamSession> getExamSessionById(Long id) {
        return examSessionRepository.findById(id);
    }

    public ExamSession updateExamSession(
            Long id,
            ExamSession sessionDetails) {

        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Exam session not found"));

        session.setExamName(sessionDetails.getExamName());
        session.setSubject(sessionDetails.getSubject());
        session.setExamDate(sessionDetails.getExamDate());

        return examSessionRepository.save(session);
    }

    public void deleteExamSession(Long id) {

        if (!examSessionRepository.existsById(id)) {
            throw new RuntimeException("Exam session not found");
        }

        examSessionRepository.deleteById(id);
    }
}