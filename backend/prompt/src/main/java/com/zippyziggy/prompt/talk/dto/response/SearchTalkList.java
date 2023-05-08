package com.zippyziggy.prompt.talk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchTalkList {
	// 프로필 사용자가 작성한 톡 조회
	private final Long totalTalksCnt;
	private final Integer totalPageCnt;
	private final List<SearchTalk> searchTalkList;
}
