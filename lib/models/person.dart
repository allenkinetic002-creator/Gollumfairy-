class Person {
  final String id;
  final String name;
  final String city;
  final int percent;
  final String approval;
  final String? avatarBgHex;
  final String? avatarInitial;

  const Person({
    required this.id,
    required this.name,
    required this.city,
    required this.percent,
    required this.approval,
    this.avatarBgHex,
    this.avatarInitial,
  });

  factory Person.fromJson(Map<String, dynamic> json) {
    return Person(
      id: json['id'] as String,
      name: json['name'] as String,
      city: json['city'] as String,
      percent: json['percent'] as int,
      approval: json['approval'] as String,
      avatarBgHex: json['avatarBgHex'] as String?,
      avatarInitial: json['avatarInitial'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'city': city,
      'percent': percent,
      'approval': approval,
      'avatarBgHex': avatarBgHex,
      'avatarInitial': avatarInitial,
    };
  }
}

const List<Person> kInitialPeople = [
  Person(
    id: 'p-elena',
    name: 'Elena Rostova',
    city: 'Berlin',
    percent: 91,
    approval: '85+',
    avatarBgHex: '#D97706',
    avatarInitial: 'ER',
  ),
  Person(
    id: 'p-clara',
    name: 'Clara Vance',
    city: 'New York',
    percent: 88,
    approval: '54+',
    avatarBgHex: '#4F46E5',
    avatarInitial: 'CV',
  ),
  Person(
    id: 'p-alex',
    name: 'Alex Rivers',
    city: 'San Francisco',
    percent: 94,
    approval: '68+',
    avatarBgHex: '#059669',
    avatarInitial: 'AR',
  ),
  Person(
    id: 'p-sarah',
    name: 'Sarah Chen',
    city: 'New York',
    percent: 89,
    approval: '62+',
    avatarBgHex: '#9333EA',
    avatarInitial: 'SC',
  ),
  Person(
    id: 'p-zack',
    name: 'Zack Thorne',
    city: 'Austin',
    percent: 76,
    approval: '42+',
    avatarBgHex: '#7C3AED',
    avatarInitial: 'ZT',
  ),
  Person(
    id: 'p-maya',
    name: 'Maya Lin',
    city: 'London',
    percent: 62,
    approval: '39+',
    avatarBgHex: '#0D9488',
    avatarInitial: 'ML',
  ),
  Person(
    id: 'p-devontae',
    name: 'Devontae Cole',
    city: 'Atlanta',
    percent: 48,
    approval: '27+',
    avatarBgHex: '#E11D48',
    avatarInitial: 'DC',
  ),
  Person(
    id: 'p-marcus',
    name: 'Marcus Vance',
    city: 'San Francisco',
    percent: 95,
    approval: '72+',
    avatarBgHex: '#2563EB',
    avatarInitial: 'MV',
  ),
  Person(
    id: 'p-jordan',
    name: 'Jordan Taylor',
    city: 'Seattle',
    percent: 45,
    approval: '19+',
    avatarBgHex: '#334155',
    avatarInitial: 'JT',
  ),
];
