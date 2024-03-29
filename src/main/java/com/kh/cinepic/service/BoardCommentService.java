package com.kh.cinepic.service;

import com.kh.cinepic.dto.BoardCommentReqDto;
import com.kh.cinepic.dto.BoardCommentResDto;
import com.kh.cinepic.entity.*;
import com.kh.cinepic.repository.BoardCommentRepository;
import com.kh.cinepic.repository.BoardRepository;
import com.kh.cinepic.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardCommentService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    @Autowired
    private BoardCommentRepository boardCommentRepository;


    // 댓글 등록
    @Transactional
    public boolean saveBoardComment (BoardCommentReqDto boardCommentReqDto, Long id) {
        try {
            BoardComment boardComment = new BoardComment();
            Member member = memberRepository.findById(id).orElseThrow(
                    () -> new RuntimeException("존재하지 않는 회원입니다.")
            );
            Board board = boardRepository.findById(boardCommentReqDto.getBoardId()).orElseThrow(
                    () -> new RuntimeException("존재하지 않는 게시글입니다.")
            );
            boardComment.setMember(member);
            boardComment.setBoard(board);
            boardComment.setCommentText(boardCommentReqDto.getCommentText());
            boardComment.setCommentRegDate(LocalDateTime.now());
            boardCommentRepository.save(boardComment);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 댓글 수정
    public boolean commentModify (BoardCommentReqDto commentReqDto) {
        try {
            BoardComment boardComment = boardCommentRepository.findById(commentReqDto.getId()).orElseThrow(
                    () -> new RuntimeException("존재하지 않는 댓글입니다.")
            );
            String text = "";
            if (commentReqDto.getCommentText().isEmpty()){
                text = boardComment.getCommentText();
            }else {
                text = commentReqDto.getCommentText();
            }
            boardComment.setCommentText(text);
            boardCommentRepository.save(boardComment);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 댓글 삭제
    public boolean commentDelete(Long id) {
        try {
            BoardComment boardComment = boardCommentRepository.findById(id).orElseThrow(
                    () -> new RuntimeException("해당 댓글이 존재하지 않습니다.")
            );
            boardCommentRepository.delete(boardComment);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 댓글 리스트
    public List<BoardCommentResDto> getBoardCommentList (Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("존재하지 않는 게시글입니다."));
        List<BoardComment> boardComments = boardCommentRepository.findByBoard(board);
        List<BoardCommentResDto> boardCommentResDtos = new ArrayList<>();
        for (BoardComment boardComment : boardComments) {
            boardCommentResDtos.add(convertEntityToDto(boardComment));
        }
        return boardCommentResDtos;
    }

    // 댓글 총 페이지수
    public int getTotalBoardCommentPage(Pageable pageable, Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new RuntimeException("board ID : " + boardId + "가 존재하지 않습니다.")
        );
        Page<BoardComment> boardCommentPage = boardCommentRepository.findByBoard(board, pageable);
        return boardCommentPage.getTotalPages();
    }

    // 댓글 페이지네이션
    public List<BoardCommentResDto> getBoardCommentPageList(int page, int size, Long boardId) {
        Pageable pageable = PageRequest.of(page,size,Sort.by(Sort.Order.desc("commentRegDate")));
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new RuntimeException("board ID : " + boardId + "가 존재하지 않습니다.")
        );
        List<BoardComment> boardComments = boardCommentRepository.findByBoard(board, pageable).getContent();
        List<BoardCommentResDto> boardCommentResDtos = new ArrayList<>();
        for (BoardComment boardComment : boardComments) {
            boardCommentResDtos.add(convertEntityToDto(boardComment));
        }
        return boardCommentResDtos;
    }

    // 댓글 엔티티를 Dto로 변환
    public BoardCommentResDto convertEntityToDto (BoardComment boardComment) {
        BoardCommentResDto boardCommentResDto = new BoardCommentResDto();
        boardCommentResDto.setBoardId(boardComment.getBoard().getId());
        boardCommentResDto.setMemberAlias(boardComment.getMember().getAlias());
        boardCommentResDto.setMemberImage(boardComment.getMember().getImage());
        boardCommentResDto.setCommentText(boardComment.getCommentText());
        boardCommentResDto.setCommentId(boardComment.getId());
        boardCommentResDto.setCommentRegDate(boardComment.getCommentRegDate());
        return boardCommentResDto;
    }


}
