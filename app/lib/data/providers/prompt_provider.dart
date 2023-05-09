import 'package:app/data/model/prompt_model.dart';
import 'package:app/data/repository/prompt_repository.dart';
import 'package:flutter/material.dart';

class PromptProvider extends ChangeNotifier {
  final PromptRepository _promptRepository = PromptRepository();
  List<PromptModel> _promptList = [];
  List<PromptModel> get promptList => _promptList;
  PromptDetailModel prompt = PromptDetailModel();
  int totalPageCnt = 0;
  int totalPromptsCnt = 0;
  String error = "";
  bool isLoading = false;

  // 프롬프트 목록 조회
  Future<void> getPromptList({keyword, category, sort, page, size}) async {
    isLoading = true;
    notifyListeners();
    try {
      Map<String, dynamic> data = await _promptRepository.getPromptListAPI(
          keyword, category, sort, page, size);
      _promptList += data["promptList"];
      totalPageCnt = data["totalPageCnt"];
      totalPromptsCnt = data["totalPromptsCnt"];
    } catch (e) {
      error = "error";
      print('프롬프트 목록 조회 실패 $e');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // 프롬프트 상세 조회
  Future<void> getPromptDetail({promptUuid}) async {
    try {
      Map<String, dynamic> data =
          await _promptRepository.getPromptDetailAPI(promptUuid);
      prompt = data['prompt'];
      notifyListeners();
    } catch (e) {
      error = "error";
      print('프롬프트 상세 조회 실패 $e');
    }
  }

  // 프롬프트 북마크
  Future<bool> promptBookmark({promptUuid}) async {
    try {
      bool data = await _promptRepository.promptBookmarkAPI(promptUuid);
      return data;
    } catch (e) {
      return false;
    }
  }

  // 프롬프트 좋아요
  Future<bool> promptLike({promptUuid}) async {
    try {
      bool data = await _promptRepository.promptBookmarkAPI(promptUuid);
      return data;
    } catch (e) {
      return false;
    }
  }

  void initProvider() {
    _promptList = [];
    totalPageCnt = 0;
    totalPromptsCnt = 0;
    isLoading = false;
    error = "";
    prompt = PromptDetailModel();
    notifyListeners();
  }
}
