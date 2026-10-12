import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/person.dart';
import '../state/matches_controller.dart';
import 'chat_screen.dart';

class MatchesScreen extends StatefulWidget {
  const MatchesScreen({super.key});

  @override
  State<MatchesScreen> createState() => _MatchesScreenState();
}

class _MatchesScreenState extends State<MatchesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _filter = 'all'; // 'all', 'high', 'chatting'

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<MatchesController>();

    final filteredPeople = controller.people.where((person) {
      final q = _searchQuery.toLowerCase().trim();
      final matchesSearch = q.isEmpty ||
          person.name.toLowerCase().contains(q) ||
          person.city.toLowerCase().contains(q) ||
          'vibe coder'.contains(q);

      if (!matchesSearch) return false;

      if (_filter == 'high') {
        return person.percent >= 80;
      }
      if (_filter == 'chatting') {
        return controller.hasActiveTimer(person.id);
      }
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'See for your matches',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Reset matches list',
            onPressed: () => controller.load(),
          ),
        ],
      ),
      body: SafeArea(
        child: controller.isLoading
            ? const Center(child: CircularProgressIndicator())
            : controller.people.isEmpty
                ? const Center(
                    child: Text(
                      'No one left',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.black54,
                      ),
                    ),
                  )
                : Column(
                    children: [
                      // Search bar for matches
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: TextField(
                          controller: _searchController,
                          onChanged: (val) => setState(() => _searchQuery = val),
                          decoration: InputDecoration(
                            hintText: 'Search people or promises...',
                            prefixIcon: const Icon(Icons.search, size: 20),
                            suffixIcon: _searchQuery.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.clear, size: 18),
                                    onPressed: () {
                                      _searchController.clear();
                                      setState(() => _searchQuery = '');
                                    },
                                  )
                                : null,
                            contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                            filled: true,
                            fillColor: Colors.grey.shade100,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ),

                      // Filter chips
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          children: [
                            ChoiceChip(
                              label: Text('All (${controller.people.length})'),
                              selected: _filter == 'all',
                              onSelected: (_) => setState(() => _filter = 'all'),
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Top Ratings (≥80%)'),
                              selected: _filter == 'high',
                              onSelected: (_) => setState(() => _filter = 'high'),
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Chatting (Active)'),
                              selected: _filter == 'chatting',
                              onSelected: (_) => setState(() => _filter = 'chatting'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),

                      // List
                      Expanded(
                        child: filteredPeople.isEmpty
                            ? Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.search_off, size: 48, color: Colors.grey),
                                    const SizedBox(height: 8),
                                    Text(
                                      'No matches found for "$_searchQuery"',
                                      style: const TextStyle(color: Colors.grey),
                                    ),
                                  ],
                                ),
                              )
                            : ListView.separated(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                itemCount: filteredPeople.length,
                                separatorBuilder: (_, __) => const SizedBox(height: 12),
                                itemBuilder: (context, index) {
                                  final person = filteredPeople[index];
                                  final isChatting = controller.hasActiveTimer(person.id);
                                  final isGreen = person.percent >= 50;

                                  return Container(
                                    clipBehavior: Clip.antiAlias,
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: Colors.grey.shade200),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.02),
                                          blurRadius: 4,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 24,
                                          backgroundColor: Colors.grey.shade200,
                                          child: Text(
                                            person.name.isNotEmpty ? person.name[0] : '?',
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                person.name,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 15,
                                                ),
                                              ),
                                              const SizedBox(height: 2),
                                              const Text(
                                                'Vibe coder',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.black87,
                                                ),
                                              ),
                                              Text(
                                                person.city,
                                                style: TextStyle(
                                                  fontSize: 11,
                                                  color: Colors.grey.shade600,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.end,
                                          children: [
                                            Text(
                                              '${person.percent}%',
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                                color: isGreen ? Colors.green.shade700 : Colors.red.shade700,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              person.approval,
                                              style: TextStyle(
                                                fontSize: 11,
                                                color: Colors.grey.shade600,
                                              ),
                                            ),
                                            const SizedBox(height: 6),
                                            ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: Colors.black,
                                                foregroundColor: Colors.white,
                                                shape: const StadiumBorder(),
                                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                                                minimumSize: const Size(0, 30),
                                              ),
                                              onPressed: () {
                                                controller.openChat(person.id);
                                                Navigator.push(
                                                  context,
                                                  MaterialPageRoute(
                                                    builder: (_) => ChatScreen(person: person),
                                                  ),
                                                );
                                              },
                                              child: Text(
                                                isChatting ? 'Chatting' : 'Message',
                                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                      ),
                    ],
                  ),
      ),
    );
  }
}
