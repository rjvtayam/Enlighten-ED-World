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
        
        for category_name, scores in skills_data.items():
            try:
                category = CategoryType[category_name.upper()]
                level = self.predict_level(category, scores)
                
                # Get learning resources for skills that need improvement
                resources = {}
                for i, score in enumerate(scores, 1):
                    skill_name = f"{category_name}_skill_{i}"
                    if (level == SkillLevel.BEGINNER and score < 2) or \
                       (level == SkillLevel.INTERMEDIATE and score < 3):
                        resources[skill_name] = self.fetch_learning_resources(skill_name, level)
                
                results[category.name] = {
                    'level': level.value,
                    'scores': scores,
                    'resources': resources
                }
            except Exception as e:
                print(f"Error analyzing {category_name}: {str(e)}")
                results[category_name] = {
                    'level': SkillLevel.BEGINNER.value,
                    'scores': scores,
                    'resources': {}
                }
        
        return results
