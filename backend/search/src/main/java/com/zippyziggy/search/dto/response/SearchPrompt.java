package com.zippyziggy.search.dto.response;

import com.zippyziggy.search.model.EsPrompt;
import java.time.ZoneId;
import lombok.Builder;
import lombok.Data;

@Data
public class SearchPrompt {

    public static SearchPrompt of(
        EsPrompt esPrompt,
        Prompt prompt,
        Integer talkCnt,
        Integer commentCnt,
        Long likeCnt,
        Boolean isLiked,
        Boolean isBookmarked,
        Writer writer
    ) {

        return SearchPrompt.builder()
            .promptUuid(esPrompt.getPromptUuid())
            .title(esPrompt.getTitle())
            .description(esPrompt.getDescription())
            .category(esPrompt.getCategory())
            .originalPromptUuid(esPrompt.getOriginalPromptUuid())

            .thumbnail(prompt.getThumbnail())
            .regDt(prompt.getRegDt())
            .updDt(prompt.getUpdDt())

            .talkCnt(talkCnt)
            .commentCnt(commentCnt)
            .likeCnt(likeCnt)
            .isLiked(isLiked)
            .isBookmarked(isBookmarked)

            .writer(writer)
            .build();
    }

    private final String promptUuid;
    private final String title;
    private final String description;
    private final String category;
    private final String originalPromptUuid;

    private final String thumbnail;
    private final Integer hit;
    private final Long regDt;
    private final Long updDt;

    private final Integer talkCnt;
    private final Integer commentCnt;
    private final Long likeCnt;
    private final Boolean isLiked;
    private final Boolean isBookmarked;

    private final Writer writer;

    @Builder
    public SearchPrompt(
        String promptUuid,
        String title,
        String description,
        String category,
        String originalPromptUuid,

        String thumbnail,
        Integer hit,
        Long regDt,
        Long updDt,

        Integer talkCnt,
        Integer commentCnt,
        Long likeCnt,
        Boolean isLiked,
        Boolean isBookmarked,

        Writer writer
    ) {
        this.promptUuid = promptUuid;
        this.title = title;
        this.description = description;
        this.category = category;
        this.originalPromptUuid = originalPromptUuid;

        this.thumbnail = thumbnail;
        this.hit = hit;
        this.regDt = regDt;
        this.updDt = updDt;

        this.talkCnt = talkCnt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
        this.isBookmarked = isBookmarked;

        this.writer = writer;
    }

}
