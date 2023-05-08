package com.zippyziggy.prompt.talk.dto.response;

import com.zippyziggy.prompt.prompt.dto.response.MemberResponse;
import com.zippyziggy.prompt.prompt.dto.response.WriterResponse;
import com.zippyziggy.prompt.talk.model.Talk;
import java.time.ZoneId;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchTalk {

	private Long talkId;
	private String title;
	private String question;
	private String answer;
	private WriterResponse writer;
	private Long likeCnt;
	private Long commentCnt;
	private Boolean isLiked;
	private Long regDt;
	private Long hit;

	public static SearchTalk from(
			Talk talk,
			String question,
			String answer,
			MemberResponse member,
			Long likeCnt,
			Long commentCnt,
			Boolean isLiked
	) {
		return SearchTalk.builder()
				.talkId(talk.getId())
				.title(talk.getTitle())
				.question(question)
				.answer(answer)
				.writer(member.toWriterResponse())
				.likeCnt(likeCnt)
				.commentCnt(commentCnt)
				.isLiked(isLiked)
				.regDt(talk.getRegDt().atZone(ZoneId.systemDefault()).toInstant().getEpochSecond())
				.hit(talk.getHit())
				.build();
	}
}
