package com.zippyziggy.member.client;


import com.zippyziggy.member.dto.response.PromptCardResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="prompt")
public interface PromptClient {
    @GetMapping("/prompts/members/like/{crntMemberUuid}")
    List<PromptCardResponse> getPromptsLike(@PathVariable("crntMemberUuid") String crntMemberUuid,
                                            @RequestParam("page") Integer page,
                                            @RequestParam("size") Integer size);

    @GetMapping("/prompts/members/bookmark/{crntMemberUuid}")
    List<PromptCardResponse> getPromptsBookmark(@PathVariable("crntMemberUuid") String crntMemberUuid,
                                                @RequestParam("page") Integer page,
                                                @RequestParam("size") Integer size);
}