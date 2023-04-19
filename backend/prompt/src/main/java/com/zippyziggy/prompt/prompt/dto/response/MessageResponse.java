package com.zippyziggy.prompt.prompt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
	private String prefix;
	private String example;
	private String suffix;
}
