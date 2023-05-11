import 'dart:convert';
import 'dart:io';

import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/model/navigation_model.dart';
import 'package:zippy_ziggy/data/model/user_model.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:zippy_ziggy/widgets/my_appbar.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:provider/provider.dart';

class SignUpPage extends StatefulWidget {
  SocialSignUpModel data;
  SignUpPage({
    super.key,
    required this.data,
  });

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  late File? _image;
  late String? _imageUrl;
  final TextEditingController _nicknameController = TextEditingController();
  String nickname = '';
  bool nicknameCheck = true;
  final _formKey = GlobalKey<FormState>();

  void _tryValidation() {
    final isValid = _formKey.currentState!.validate();
    if (isValid) {
      _formKey.currentState!.save();
    }
  }

  // 이미지 가져오기
  Future getImage() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      maxHeight: 80,
      maxWidth: 80,
      imageQuality: 30,
    );

    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
        _imageUrl = pickedFile.path;
      } else {
        print('No image selected.');
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _image = null;
    _imageUrl = null;
    nickname = '';
    nicknameCheck = true;
  }

  @override
  void dispose() {
    super.dispose();
  }

  // 회원가입 요청
  handleSignUp() async {
    final provider = Provider.of<UserProvider>(context, listen: false);
    navigator(name) {
      Navigator.pushNamedAndRemoveUntil(context, name, (route) => false);
    }

    if (nickname.length > 10) {
      return;
    }
    final resultNicknameCheck = await provider.getNickname(nickname);
    if (!resultNicknameCheck) {
      setState(() {
        nicknameCheck = false;
        _tryValidation();
      });
      return;
    }
    final userData = {
      'nickname': nickname,
      'name': widget.data.name,
      'platform': widget.data.platform,
      'platformId': widget.data.platformId,
      'profileImg': widget.data.profileImg,
    };

    // 프로필 사진 데이터
    FormData formData;
    if (_imageUrl != null) {
      formData = FormData.fromMap(
        {
          'file': await MultipartFile.fromFile(
            _imageUrl!,
            filename: _imageUrl,
            contentType: MediaType('image', 'png'),
          ),
          'user': MultipartFile.fromString(
            json.encode(userData),
            contentType: MediaType('application', 'json'),
          ),
        },
      );
    } else {
      formData = FormData.fromMap(
        ({
          'file': MultipartFile.fromBytes(
            List.empty(),
            filename: 'empty_image.png',
            contentType: MediaType('image', 'png'),
          ),
          'user': MultipartFile.fromString(
            json.encode(userData),
            contentType: MediaType('application', 'json'),
          )
        }),
      );
    }
    final data = await provider.postSignUp(formData);
    if (data) {
      navigator(RoutesName.main);
      Provider.of<NavigationProvider>(context, listen: false)
          .setNavigationItem(NavigationItem.main);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppbar(),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Form(
              key: _formKey,
              child: Column(
                children: [
                  Text(
                    '${widget.data.name}님 반가워요!',
                    style: AppTheme.headline,
                  ),
                  Text(
                    '닉네임을 설정하고 회원가입을 완료하세요!',
                    style: AppTheme.caption.copyWith(fontSize: 14),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  GestureDetector(
                    onTap: getImage,
                    child: Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(100),
                          child: _image == null
                              ? Image.network(
                                  widget.data.profileImg!,
                                  width: 150,
                                  height: 150,
                                  fit: BoxFit.cover,
                                )
                              : Image.file(
                                  _image!,
                                  width: 200,
                                  height: 200,
                                  fit: BoxFit.cover,
                                ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.black,
                            ),
                            child: FloatingActionButton(
                              backgroundColor: Colors.green.withOpacity(0.9),
                              mini: true,
                              onPressed: getImage,
                              child: const Icon(
                                Icons.add,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: TextFormField(
                      controller: _nicknameController,
                      key: const ValueKey(1),
                      validator: (value) {
                        if (value!.isNotEmpty && value.length > 10) {
                          return '10자 이하로 작성해주세요';
                        } else if (value.isNotEmpty && !nicknameCheck) {
                          return '중복된 닉네임입니다';
                        } else if (value.isEmpty) {
                          return '닉네임을 입력해주세요';
                        }
                        return null;
                      },
                      onSaved: (value) {
                        nickname = value!;
                      },
                      onChanged: (value) {
                        _tryValidation();
                        setState(
                          () {
                            nickname = value;
                            if (!nicknameCheck) {
                              nicknameCheck = true;
                            }
                          },
                        );
                      },
                      decoration: InputDecoration(
                        prefixIcon: const Icon(
                          Icons.account_circle,
                          color: Colors.grey,
                        ),
                        enabledBorder: const OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                          borderRadius: BorderRadius.all(Radius.circular(35)),
                        ),
                        focusedBorder: const OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.all(Radius.circular(35)),
                        ),
                        hintText: '닉네임을 입력해주세요',
                        hintStyle: AppTheme.body2.copyWith(color: Colors.grey),
                        contentPadding: const EdgeInsets.all(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: SizedBox(
                      width: MediaQuery.of(context).size.width,
                      child: CupertinoButton(
                        onPressed: () {
                          handleSignUp();
                        },
                        padding: const EdgeInsets.all(12),
                        borderRadius: BorderRadius.circular(30),
                        color: Colors.grey,
                        child: const Text(
                          '회원가입',
                          style: AppTheme.title,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
