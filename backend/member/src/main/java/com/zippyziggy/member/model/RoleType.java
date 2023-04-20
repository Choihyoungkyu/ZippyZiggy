package com.zippyziggy.member.model;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum RoleType {
	USER("user"), ADMIN("admin");

	private final String role;

	RoleType(String role) {
		this.role = role;
	}

	public String getRole() {
		return role;
	}
}
