package com.seatplan.service;

import com.seatplan.entity.ExamSession;
import com.seatplan.entity.Hall;
import com.seatplan.entity.Seat;
import com.seatplan.entity.Student;
import com.seatplan.repository.ExamSessionRepository;
import com.seatplan.repository.HallRepository;
import com.seatplan.repository.SeatRepository;
import com.seatplan.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatingService {

    private final HallRepository hallRepository;
    private final StudentRepository studentRepository;
    private final ExamSessionRepository examSessionRepository;
    private final SeatRepository seatRepository;

    public SeatingService(HallRepository hallRepository,
                          StudentRepository studentRepository,
                          ExamSessionRepository examSessionRepository,
                          SeatRepository seatRepository) {

        this.hallRepository = hallRepository;
        this.studentRepository = studentRepository;
        this.examSessionRepository = examSessionRepository;
        this.seatRepository = seatRepository;
    }


    @Transactional
    public List<Seat> generateSeating(Long sessionId, Long hallId) {

        // 1. Find hall
        Hall hall = hallRepository.findById(hallId)
                .orElseThrow(() ->
                        new RuntimeException("Hall not found"));


        // 2. Find exam session
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new RuntimeException("Exam session not found"));


        // 3. Get all students
        List<Student> students =
                studentRepository.findAll();


        // 4. Check capacity
        if (students.size() > hall.getCapacity()) {

            throw new RuntimeException(
                    "Not enough seats available. Hall capacity: "
                            + hall.getCapacity()
                            + ", Students: "
                            + students.size()
            );
        }


        // 5. Delete old seating plan
        List<Seat> oldSeats =
                seatRepository.findByHallIdAndExamSessionId(
                        hallId,
                        sessionId
                );

        seatRepository.deleteAll(oldSeats);


        List<Student> remainingStudents =
                new ArrayList<>(students);

        List<Seat> generatedSeats =
                new ArrayList<>();


        // 6. Generate seats row by row
        for (int row = 1;
             row <= hall.getRowCount();
             row++) {

            for (int column = 1;
                 column <= hall.getColumnCount();
                 column++) {


                // Stop when capacity is reached
                if (generatedSeats.size()
                        >= hall.getCapacity()) {

                    break;
                }


                // Stop when all students are assigned
                if (remainingStudents.isEmpty()) {

                    break;
                }


                Student selectedStudent = null;


                // Find a student without
                // nearby class/section conflict
                for (Student student :
                        remainingStudents) {

                    boolean conflict = false;


                    // Check left seat
                    if (column > 1) {

                        Student leftStudent =
                                getStudentAt(
                                        generatedSeats,
                                        row,
                                        column - 1
                                );


                        if (leftStudent != null &&
                                sameClassAndSection(
                                        student,
                                        leftStudent
                                )) {

                            conflict = true;
                        }
                    }


                    // Check upper seat
                    if (row > 1) {

                        Student upperStudent =
                                getStudentAt(
                                        generatedSeats,
                                        row - 1,
                                        column
                                );


                        if (upperStudent != null &&
                                sameClassAndSection(
                                        student,
                                        upperStudent
                                )) {

                            conflict = true;
                        }
                    }


                    if (!conflict) {

                        selectedStudent =
                                student;

                        break;
                    }
                }


                // If no conflict-free student exists,
                // use the first remaining student
                if (selectedStudent == null) {

                    selectedStudent =
                            remainingStudents.get(0);
                }


                // Create seat number
                String seatNumber =
                        "R"
                                + row
                                + "-C"
                                + column;


                Seat seat = new Seat(
                        seatNumber,
                        row,
                        column,
                        hall,
                        selectedStudent,
                        session
                );


                generatedSeats.add(seat);

                remainingStudents.remove(
                        selectedStudent
                );
            }
        }


        // 7. Save seating plan
        return seatRepository.saveAll(
                generatedSeats
        );
    }


    // Check whether two students belong
    // to the same class and section
    private boolean sameClassAndSection(
            Student student1,
            Student student2) {

        return student1.getClassName()
                .equalsIgnoreCase(
                        student2.getClassName()
                )

                &&

                student1.getSection()
                        .equalsIgnoreCase(
                                student2.getSection()
                        );
    }


    // Find student already assigned
    // to a particular seat position
    private Student getStudentAt(
            List<Seat> seats,
            int row,
            int column) {

        for (Seat seat : seats) {

            if (seat.getRowNumber() == row &&
                    seat.getColumnNumber() == column) {

                return seat.getStudent();
            }
        }

        return null;
    }


    // Find seating details
    // using student register number
    public List<Seat> findStudentSeats(
            String registerNumber) {

        Student student =
                studentRepository
                        .findByRegisterNumber(
                                registerNumber
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );


        return seatRepository.findByStudent_Id(
                student.getId()
        );
    }

}