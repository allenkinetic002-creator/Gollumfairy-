import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/person.dart';

const String _kPeopleKey = 'vibe_matches_people_v1';
const String _kTimersKey = 'vibe_matches_timers_v1';
const int kFiveHoursMs = 5 * 60 * 60 * 1000;

class MatchesController extends ChangeNotifier {
  List<Person> _people = [];
  Map<String, int> _timers = {};
  bool _isLoading = true;

  List<Person> get people => _people;
  Map<String, int> get timers => _timers;
  bool get isLoading => _isLoading;

  MatchesController() {
    load();
  }

  Future<void> load() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final peopleJson = prefs.getString(_kPeopleKey);
      final timersJson = prefs.getString(_kTimersKey);

      if (peopleJson != null && peopleJson.isNotEmpty) {
        final List<dynamic> decoded = jsonDecode(peopleJson);
        _people = decoded.map((e) => Person.fromJson(e as Map<String, dynamic>)).toList();
      } else {
        _people = List.from(kInitialPeople);
      }

      if (timersJson != null && timersJson.isNotEmpty) {
        final Map<String, dynamic> decoded = jsonDecode(timersJson);
        _timers = decoded.map((k, v) => MapEntry(k, v as int));
      } else {
        _timers = {};
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error loading matches: $e');
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> save() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final peopleJson = jsonEncode(_people.map((p) => p.toJson()).toList());
      final timersJson = jsonEncode(_timers);

      await prefs.setString(_kPeopleKey, peopleJson);
      await prefs.setString(_kTimersKey, timersJson);
    } catch (e) {
      if (kDebugMode) {
        print('Error saving matches: $e');
      }
    }
  }

  /// Opens the chat for a person. The first time, start a 5-hour countdown.
  /// Reopening the same chat must NOT reset the timer.
  void openChat(String id) {
    if (!_timers.containsKey(id)) {
      _timers[id] = DateTime.now().millisecondsSinceEpoch;
      save();
      notifyListeners();
    }
  }

  /// Returns remaining milliseconds, or 0 if expired.
  int getRemainingMs(String id) {
    final startedAt = _timers[id];
    if (startedAt == null) return kFiveHoursMs;
    final remaining = (startedAt + kFiveHoursMs) - DateTime.now().millisecondsSinceEpoch;
    return remaining > 0 ? remaining : 0;
  }

  bool isTimerExpired(String id) {
    final startedAt = _timers[id];
    if (startedAt == null) return false;
    return (startedAt + kFiveHoursMs) - DateTime.now().millisecondsSinceEpoch <= 0;
  }

  bool hasActiveTimer(String id) {
    return _timers.containsKey(id);
  }

  /// Good reply: ADD +5% to their match score (max 100%), clear timer, stay in chat
  void markGood(String id) {
    final index = _people.indexWhere((p) => p.id == id);
    if (index != -1) {
      final p = _people[index];
      final newPercent = (p.percent + 5).clamp(0, 100);
      _people[index] = Person(
        id: p.id,
        name: p.name,
        city: p.city,
        percent: newPercent,
        approval: p.approval,
        avatarBgHex: p.avatarBgHex,
        avatarInitial: p.avatarInitial,
      );
    }
    _timers.remove(id);
    save();
    notifyListeners();
  }

  /// Bad reply: SUBTRACT -50% from their match score (min 0%), clear timer
  void markBad(String id) {
    final index = _people.indexWhere((p) => p.id == id);
    if (index != -1) {
      final p = _people[index];
      final newPercent = (p.percent - 50).clamp(0, 100);
      _people[index] = Person(
        id: p.id,
        name: p.name,
        city: p.city,
        percent: newPercent,
        approval: p.approval,
        avatarBgHex: p.avatarBgHex,
        avatarInitial: p.avatarInitial,
      );
    }
    _timers.remove(id);
    save();
    notifyListeners();
  }
}
