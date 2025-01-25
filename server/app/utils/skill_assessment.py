from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np
import os
from typing import List, Dict, Tuple, Optional
from dotenv import load_dotenv
from app.models.assessment import SkillLevel, CategoryType

load_dotenv()

class SkillAssessment:
    def __init__(self):
        self.scaler = StandardScaler()
        self.knn = KNeighborsClassifier(n_neighbors=3)  # Reduced neighbors for more precise boundaries
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
            # Beginner level (scores 1-1.66)
            [1, 1, 1],
            [1, 1, 2],
            [2, 1, 1],
            [1, 2, 1],
            # Intermediate level (scores 1.67-2.33)
            [2, 2, 2],
            [2, 2, 3],
            [3, 2, 2],
            [2, 3, 2],
            # Advanced level (scores 2.34-3)
            [3, 3, 3],
            [3, 3, 2],
            [2, 3, 3],
            [3, 2, 3]
        ])
        y = np.array([
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value,
            SkillLevel.ADVANCED.value
        ])
        return X, y
    
    def _generate_soft_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Generate training data for soft skills"""
        X = np.array([
            # Beginner level (scores 1-1.66)
            [1, 1, 1],
            [1, 1, 2],
            [2, 1, 1],
            [1, 2, 1],
            # Intermediate level (scores 1.67-2.33)
            [2, 2, 2],
            [2, 2, 3],
            [3, 2, 2],
            [2, 3, 2],
            # Advanced level (scores 2.34-3)
            [3, 3, 3],
            [3, 3, 2],
            [2, 3, 3],
            [3, 2, 3]
        ])
        y = np.array([
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.BEGINNER.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.INTERMEDIATE.value,
            SkillLevel.ADVANCED.value,
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
        
        # Get probabilities for each class
        probabilities = self.knn.predict_proba(scores_scaled)[0]
        confidence = max(probabilities)
        
        # If confidence is low, use score-based approach as fallback
        if confidence < 0.6:
            avg_score = sum(scores) / len(scores)
            if avg_score < 1.67:
                return SkillLevel.BEGINNER
            elif avg_score < 2.34:
                return SkillLevel.INTERMEDIATE
            else:
                return SkillLevel.ADVANCED
        
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

    def analyze_skills(self, skills_data: Dict[str, List[int]]) -> Dict:
        """Analyze skills and provide recommendations"""
        results = {}
        
        # Process each category
        for category, scores in skills_data.items():
            try:
                # Convert category string to enum
                category_type = CategoryType[category.upper()]
                
                # Predict level for this category
                predicted_level = self.predict_level(category_type, scores)
                
                # Calculate score as percentage
                category_score = (sum(scores) / len(scores)) / 3 * 100
                
                results[category] = {
                    'level': predicted_level.value,
                    'score': category_score
                }
            except Exception as e:
                print(f"Error analyzing {category}: {str(e)}")
                results[category] = {
                    'level': SkillLevel.BEGINNER.value,
                    'score': (sum(scores) / len(scores)) / 3 * 100
                }
        
        # Calculate overall score
        all_scores = [score for scores_list in skills_data.values() for score in scores_list]
        overall_score = (sum(all_scores) / len(all_scores)) / 3 * 100
        
        return {
            'categories': results,
            'overall_score': overall_score,
            'overall_level': self.get_overall_level(sum(all_scores) / len(all_scores))
        }
