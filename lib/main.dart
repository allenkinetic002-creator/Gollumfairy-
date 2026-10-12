import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/matches_screen.dart';
import 'state/matches_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const VibeMatchesApp());
}

class VibeMatchesApp extends StatelessWidget {
  const VibeMatchesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => MatchesController(),
      child: MaterialApp(
        title: 'Vibe Matches',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.black,
            brightness: Brightness.light,
          ),
          scaffoldBackgroundColor: const Color(0xFFFAFAFA),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            elevation: 0,
            scrolledUnderElevation: 1,
            centerTitle: false,
          ),
        ),
        home: const MatchesScreen(),
      ),
    );
  }
}
