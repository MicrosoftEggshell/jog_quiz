#define _CRT_SECURE_NO_WARNINGS

#include <ostream>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <iomanip>
#include <sstream>

#include <filesystem>

using namespace std;

struct question {
	string question;
	string a, b, c, d;
};

string quote(const string & str) {
	stringstream ss;
	ss << std::quoted(str);
	return ss.str();
}

std::ostream & operator<<(std::ostream & os, const question & q) {
	os << "{";
	os << "\"question\":" << quote(q.question) << ",";
	os << "\"a\":" << quote(q.a) << ",";
	os << "\"b\":" << quote(q.b) << ",";
	os << "\"c\":" << quote(q.c) << ",";
	os << "\"d\":" << quote(q.d) << "";
	os << "}";
	return os;
}

int main() {
	cout << filesystem::current_path() << endl;

	ifstream file("Jog_tesztkerdesek.txt");
	//file.exceptions(ifstream::failbit | ifstream::badbit);

	cout << "OK File" << endl;

	string line;
	char state = 'x';
	string key;
	int number = 0, last = 0;
	vector<question> vec(184);
	auto * que = &vec[0];
	while (getline(file, line)) {
		//cout << key << "" << number<< endl;
	re_case:;
		switch (state) {
		case 'q':
			que->question += line;
			state = 'a';
			break;
		case 'a':
			if (line[0] != 'a' || line[1] != ')' || line[2] != ' ') {
				cout << "maybe error: " << line << endl;
				que->question += " ";
				state = 'q';
				goto re_case;
			}
			que->a = line.substr(line.find(' '));
			state = 'b';
			break;
		case 'b':
			que->b = line.substr(line.find(' '));
			state = 'c';
			break;
		case 'c':
			que->c = line.substr(line.find(' '));
			state = 'd';
			break;
		case 'd':
			que->d = line.substr(line.find(' '));
			state = 'x';
			break;
		case 'x':
			if (number == 183) {
				goto print;
			}
			if (last < 170) {
				if (sscanf(line.c_str(), "%d.\n", &number) == 1 && number == last + 1) {
					last = number;
					key = to_string(number);
					que = &vec[number - 1];
					state = 'q';
				}
			} else if (last == 170) {
				if (line.substr(0, 6) == "170/A.") {
					last = number + 1;
					key = "170/A";
					que = &vec[number];
					state = 'q';
				}
			} else if (sscanf(line.c_str(), "%d.\n", &number) == 1 && number == last) {
				last = number + 1;
				key = to_string(number);
				que = &vec[number];	
				state = 'q';
			}

			break;
		}
	}

	cout << "OK Read" << endl;
print:
	cout << "OK Read" << endl;

	ofstream data_json;
	data_json.open("data.json");
	data_json << "{\"" << 1 << "\":" << vec[0];
	for (int i = 1; i < vec.size(); ++i) {
		data_json << ",\"" << (i + 1) << "\":" << vec[i];
	}
	data_json << "}";
	data_json.close();
	return 0;
}
