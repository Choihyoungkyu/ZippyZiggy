package com.zippyziggy.prompt.talk.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromptTalkListResponse {

	private int talkCnt;
	private List<SearchTalk> talks;

}
