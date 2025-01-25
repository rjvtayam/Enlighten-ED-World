from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np
import requests
import os
from typing import List, Dict, Tuple, Optional
from dotenv import load_dotenv
from app.models.assessment import SkillLevel, CategoryType

load_dotenv()

class SkillAssessment:
    def __init__(self):
        self.scaler = StandardScaler()
        self.knn = KNeighborsClassifier(n_neighbors=5)
        # Pre-defined skill vectors for each category
        self.training_data = {
            CategoryType.TECHNICAL: self._generate_technical_data(),
            CategoryType.COMMUNICATION: self._generate_soft_data(),
            CategoryType.SOFT: self._generate_soft_data(),
            CategoryType.CREATIVITY: self._generate_soft_data()
        }
        
    def _generate_technical_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Generate training data for technical skills"""
        X = np.array([
            [1, 1, 1],  # Beginner
            [1, 1, 2],
            [1, 2, 1],
            [2, 1, 2],  # Intermediate
            [2, 2, 2],
            [2, 2, 3],
            [3, 2, 3],  # Advanced
            [3, 3, 2],
            [3, 3, 3]
        ])
        y = np.array([
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value
        ])
        return X, y
    
    def _generate_soft_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Generate training data for soft skills"""
        X = np.array([
            [1, 1, 1],  # Beginner
            [1, 1, 2],
            [1, 2, 1],
            [2, 1, 2],  # Intermediate
            [2, 2, 2],
            [2, 2, 3],
            [3, 2, 3],  # Advanced
            [3, 3, 2],
            [3, 3, 3]
        ])
        y = np.array([
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value
        ])
        return X, y
    
    def predict_level(self, category: CategoryType, scores: List[int]) -> SkillLevel:
        """Predict skill level using KNN"""
        X, y = self.training_data[category]
        scores_array = np.array(scores).reshape(1, -1)
        
        if scores_array.shape[1] != X.shape[1]:
            raise ValueError(f"Expected {X.shape[1]} skills for {category.value}, got {scores_array.shape[1]}")
        
        # Fit and transform the data
        X_scaled = self.scaler.fit_transform(X)
        scores_scaled = self.scaler.transform(scores_array)
        
        # Fit and predict
        self.knn.fit(X_scaled, y)
        predicted_level = self.knn.predict(scores_scaled)[0]
        
        # Return the SkillLevel enum directly since we're using enum values in training data
        return SkillLevel(predicted_level)

    def get_overall_level(self, score: float) -> str:
        """
        Determine overall skill level based on score
        Args:
            score: Average score across all skills (1-3)
        Returns:
            Skill level as string (beginner, intermediate, advanced)
        """
        if score < 1.67:  # Below 1.67 (closer to 1)
            return SkillLevel.BEGINNER.value
        elif score < 2.34:  # Between 1.67 and 2.34
            return SkillLevel.INTERMEDIATE.value
        else:  # 2.34 and above (closer to 3)
            return SkillLevel.ADVANCED.value

    @staticmethod
    def fetch_learning_resources(skill: str, level: SkillLevel) -> Dict:
        """Fetch relevant learning resources from YouTube and Google"""
        youtube_key = os.getenv('YOUTUBE_API_KEY')
        google_key = os.getenv('GOOGLE_API_KEY')
        cse_id = os.getenv('CUSTOM_SEARCH_ENGINE_ID')
        
        # Skip API calls if keys are not configured
        if not all([youtube_key, google_key, cse_id]):
            return {'youtube': [], 'web': []}
        
        results = {'youtube': [], 'web': []}
        
        # YouTube search
        if youtube_key:
            youtube_url = 'https://www.googleapis.com/youtube/v3/search'
            youtube_params = {
                'key': youtube_key,
                'q': f'{skill} {level.value} programming tutorial',
                'part': 'snippet',
                'maxResults': 3,
                'type': 'video',
                'relevanceLanguage': 'en',
                'videoEmbeddable': 'true'
            }
            
            try:
                youtube_response = requests.get(youtube_url, params=youtube_params, timeout=5)
                youtube_response.raise_for_status()
                youtube_data = youtube_response.json()
                results['youtube'] = youtube_data.get('items', [])
            except Exception as e:
                print(f"YouTube API error: {str(e)}")
        
        # Google Custom Search
        if google_key and cse_id:
            google_url = 'https://www.googleapis.com/customsearch/v1'
            google_params = {
                'key': google_key,
                'cx': cse_id,
                'q': f'{skill} {level.value} programming learning resources',
                'num': 3,
                'lr': 'lang_en'
            }
            
            try:
                google_response = requests.get(google_url, params=google_params, timeout=5)
                google_response.raise_for_status()
                google_data = google_response.json()
                results['web'] = google_data.get('items', [])
            except Exception as e:
                print(f"Google API error: {str(e)}")
        
        return results

    def analyze_skills(self, skills_data: Dict[str, List[int]]) -> Dict:
        """Analyze skills and provide recommendations"""
        results = {}
        
        skill_descriptions = {
            'technical': {
                1: 'Problem Solving',
                2: 'Design Thinking',
                3: 'Problem Reframing'
            },
            'communication': {
                1: 'Written Communication',
                2: 'Verbal Communication',
                3: 'Presentation Skills'
            },
            'soft': {
                1: 'Teamwork',
                2: 'Leadership',
                3: 'Time Management'
            },
            'creativity': {
                1: 'Innovation',
                2: 'Design',
                3: 'Creative Problem Solving'
            }
        }

        recommendations = {
            SkillLevel.BEGINNER: {
                'technical': 'Focus on building foundational programming concepts and problem-solving skills.',
                'communication': 'Practice expressing technical concepts clearly and work on documentation skills.',
                'soft': 'Develop collaboration skills and engage more in team projects.',
                'creativity': 'Explore different approaches to problem-solving and design thinking.'
            },
            SkillLevel.INTERMEDIATE: {
                'technical': 'Deepen your understanding of advanced concepts and work on complex projects.',
                'communication': 'Take leadership in presentations and improve technical writing.',
                'soft': 'Mentor others and lead small team projects.',
                'creativity': 'Challenge yourself with innovative solutions and unique approaches.'
            },
            SkillLevel.ADVANCED: {
                'technical': 'Focus on system design and architecture. Consider specializing in specific areas.',
                'communication': 'Share knowledge through workshops and technical blogs.',
                'soft': 'Take on project leadership roles and mentor junior developers.',
                'creativity': 'Drive innovation in projects and explore cutting-edge technologies.'
            }
        }
        
        for category_name, scores in skills_data.items():
            try:
                category = CategoryType[category_name.upper()]
                level = self.predict_level(category, scores)
                
                # Calculate average score
                avg_score = sum(scores) / len(scores)
                
                # Identify strengths and areas for improvement
                strengths = []
                improvements = []
                for i, score in enumerate(scores, 1):
                    skill_name = skill_descriptions[category_name][i]
                    if score >= 2.5:
                        strengths.append(skill_name)
                    elif score <= 1.5:
                        improvements.append(skill_name)
                
                # Get learning resources for skills that need improvement
                resources = []
                for skill in improvements:
                    skill_resources = self.fetch_learning_resources(skill, level)
                    if skill_resources.get('youtube') or skill_resources.get('web'):
                        for yt in skill_resources.get('youtube', [])[:2]:
                            resources.append({
                                'title': yt['snippet']['title'],
                                'url': f"https://www.youtube.com/watch?v={yt['id']['videoId']}",
                                'type': 'video'
                            })
                        for web in skill_resources.get('web', [])[:2]:
                            resources.append({
                                'title': web['title'],
                                'url': web['link'],
                                'type': 'article'
                            })
                
                # Generate personalized recommendation
                base_recommendation = recommendations[level][category_name]
                specific_recommendations = []
                
                if strengths:
                    specific_recommendations.append(
                        f"Your strengths are in {', '.join(strengths)}. "
                        "Build upon these skills while working on other areas."
                    )
                
                if improvements:
                    specific_recommendations.append(
                        f"Focus on improving {', '.join(improvements)} through practice and learning resources."
                    )
                
                results[category.name] = {
                    'level': level.value,
                    'average_score': round(avg_score, 2),
                    'scores': scores,
                    'strengths': strengths,
                    'areas_for_improvement': improvements,
                    'recommendation': base_recommendation + ' ' + ' '.join(specific_recommendations),
                    'resources': resources[:4]  # Limit to top 4 resources
                }
            except Exception as e:
                print(f"Error analyzing {category_name}: {str(e)}")
                results[category_name] = {
                    'level': SkillLevel.BEGINNER.value,
                    'average_score': sum(scores) / len(scores),
                    'scores': scores,
                    'strengths': [],
                    'areas_for_improvement': [],
                    'recommendation': 'An error occurred while analyzing this category. Please try again.',
                    'resources': []
                }
        
        return results
