const fetch = require('node-fetch');

async function testStudentAPI() {
    try {
        // Test login first
        console.log('Testing login...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'mahe@uiu.ac.bd',
                password: '123456'
            })
        });

        const loginResult = await loginResponse.json();
        console.log('Login result:', loginResult);

        if (!loginResult.token) {
            console.log('Login failed, cannot test assignments endpoint');
            return;
        }

        // Test assignments endpoint
        console.log('\nTesting assignments endpoint...');
        const assignmentsResponse = await fetch('http://localhost:5000/api/student/assignments', {
            headers: {
                'Authorization': `Bearer ${loginResult.token}`,
                'Content-Type': 'application/json'
            }
        });

        const assignmentsResult = await assignmentsResponse.json();
        console.log('Assignments result:', JSON.stringify(assignmentsResult, null, 2));

        // Filter just Biology assignments
        if (assignmentsResult.data) {
            const biologyAssignments = assignmentsResult.data.filter(a => 
                a.course_name && a.course_name.toLowerCase().includes('biology')
            );
            console.log('\nBiology assignments only:', JSON.stringify(biologyAssignments, null, 2));
        }

    } catch (error) {
        console.error('Error testing API:', error.message);
    }
}

testStudentAPI();