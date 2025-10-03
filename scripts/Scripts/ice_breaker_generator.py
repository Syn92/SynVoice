import os
import csv
import argparse
from typing import Optional
from dotenv import load_dotenv
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch

# Load environment variables
load_dotenv()

def setup_gemini():
    """Initialize Gemini 2.0 Flash with API key from environment and web search capability"""
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)
    return client

def load_prompt_template(prompt_path: str = 'email_prompt.md'):
    """Load the generation prompt from markdown file"""
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"{prompt_path} not found. Please create the prompt file or pass --prompt PATH.")

def merge_email_fields(email, personal_email):
    """Merge email fields, preferring email over personal_email"""
    if email and email.strip():
        return email.strip()
    elif personal_email and personal_email.strip():
        return personal_email.strip()
    else:
        return None

def format_lead_data(lead, sender_name: str = 'Arthur'):
    """Format lead data for the prompt"""
    # Derive a primary technology/system if present
    raw_tech = lead.get('organization_technologies', '') or ''
    primary_tech = ''
    if isinstance(raw_tech, str) and raw_tech.strip():
        primary_tech = raw_tech.split(',')[0].strip()

    return {
        'first_name': lead.get('first_name', ''),
        'last_name': lead.get('last_name', ''),
        'company_name': lead.get('organization_name', ''),
        'title': lead.get('title', ''),
        'industry': lead.get('industry', ''),
        'company_description': lead.get('organization_short_description', ''),
        'company_website': lead.get('organization_website_url', ''),
        'estimated_employees': lead.get('estimated_num_employees', ''),
        'city': lead.get('city', ''),
        'state': lead.get('state', ''),
        'country': lead.get('country', ''),
        'technologies': raw_tech,
        'tech': primary_tech,
        'annual_revenue': lead.get('organization_annual_revenue_printed', ''),
        'seo_description': lead.get('organization_seo_description', ''),
        'headline': lead.get('headline', ''),
        'sender_name': sender_name,
    }

def generate_message(client, prompt_template, lead_data, model: str = "gemini-2.5-flash"):
    """Generate email/message content using Gemini with Google Search capability"""
    # Format the prompt with lead data
    formatted_prompt = prompt_template.format(**lead_data)
    
    # Create Google Search tool
    google_search_tool = Tool(google_search=GoogleSearch())
    
    try:
        response = client.models.generate_content(
            model=model,
            contents=formatted_prompt,
            config=GenerateContentConfig(
                tools=[google_search_tool],
                response_modalities=["TEXT"],
            )
        )
        
        # Extract text from response parts
        result_text = ""
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'text'):
                result_text += part.text
        
        return result_text.strip()
    except Exception as e:
        print(f"Error generating content: {e}")
        return None

def process_leads(csv_file_path, test_mode: bool = True, limit: Optional[int] = None, model: str = "gemini-2.5-flash", prompt_path: str = 'email_prompt.md', sender_name: str = 'Arthur', output_type: str = 'email'):
    """Process leads from CSV and generate content (email or icebreaker)"""
    client = setup_gemini()
    prompt_template = load_prompt_template(prompt_path)
    
    output_data = []
    
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for idx, row in enumerate(reader):
            # Respect processing limits
            if test_mode and idx > 0:
                break
            if (not test_mode) and (limit is not None) and idx >= limit:
                break
                
            print(f"Processing lead {idx + 1}: {row.get('first_name', '')} {row.get('last_name', '')} from {row.get('organization_name', '')}")
            
            # Merge email fields
            email = merge_email_fields(row.get('email', ''), row.get('personal_email', ''))
            
            if not email:
                print(f"Skipping lead {idx + 1}: No valid email found")
                continue
            
            # Format lead data for prompt
            lead_data = format_lead_data(row, sender_name=sender_name)
            
            # Generate content
            content = generate_message(client, prompt_template, lead_data, model=model)
            
            if content:
                # Check if the response indicates the company should be excluded
                if "EXCLUDE" in content.upper() or "NOT SUITABLE" in content.upper():
                    print(f"Excluding lead {idx + 1}: Company not suitable for voice agent services")
                    continue
                
                output_row = {
                    'first_name': row.get('first_name', ''),
                    'last_name': row.get('last_name', ''),
                    'email': email,
                    'companyName': row.get('organization_name', ''),
                    ('ice_breaker' if output_type == 'icebreaker' else 'email_body'): content,
                    'industry': row.get('industry', '')
                }
                output_data.append(output_row)
                print(f"Generated {output_type} for {row.get('first_name', '')} {row.get('last_name', '')}")
            else:
                print(f"Failed to generate content for lead {idx + 1}")
    
    return output_data

def save_results(output_data, output_file='email_results.csv', output_type: str = 'email'):
    """Save results to CSV file"""
    if not output_data:
        print("No data to save")
        return
    
    if output_type == 'icebreaker':
        fieldnames = ['first_name', 'last_name', 'email', 'companyName', 'ice_breaker', 'industry']
    else:
        fieldnames = ['first_name', 'last_name', 'email', 'companyName', 'email_body', 'industry']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output_data)
    
    print(f"Results saved to {output_file}")

def main():
    """Run the generator with CLI flags."""
    parser = argparse.ArgumentParser(description="Generate personalized emails or icebreakers from a leads CSV using Gemini.")
    parser.add_argument('-c', '--csv', dest='csv', default='Synvoice - Health Welness and fitness QC.csv', help='Path to input CSV file')
    parser.add_argument('-o', '--output', dest='output', default='email_test_results.csv', help='Path to output CSV file')
    mode_group = parser.add_mutually_exclusive_group()
    mode_group.add_argument('--test-mode', action='store_true', help='Process only the first lead (default)')
    mode_group.add_argument('--full', action='store_true', help='Process all leads (or up to --limit)')
    parser.add_argument('--limit', type=int, default=None, help='Max number of leads to process when using --full')
    parser.add_argument('--model', type=str, default='gemini-2.5-flash', help='Model to use for generation')
    parser.add_argument('--prompt', type=str, default='email_prompt.md', help='Path to the prompt template to use')
    parser.add_argument('--sender', type=str, default='Arthur', help='Sender name to sign the email with')
    parser.add_argument('--output-type', type=str, choices=['email', 'icebreaker'], default='email', help='Generate full email or just an icebreaker')

    args = parser.parse_args()

    # Determine mode (default: test mode)
    test_mode = True
    if args.full:
        test_mode = False
    if args.test_mode:
        test_mode = True

    print("Starting generation with Gemini 2.0 Flash + Google Search...")
    if test_mode:
        print("Running in TEST MODE - processing only the first lead")
    else:
        if args.limit is not None:
            print(f"Running in FULL MODE - processing up to {args.limit} leads")
        else:
            print("Running in FULL MODE - processing all leads")
    print("Web search will be used automatically when needed for company research")
    
    try:
        results = process_leads(
            args.csv,
            test_mode=test_mode,
            limit=args.limit,
            model=args.model,
            prompt_path=args.prompt,
            sender_name=args.sender,
            output_type=args.output_type,
        )
        save_results(results, args.output, output_type=args.output_type)
        print(f"Processed {len(results)} leads successfully")
        
        if results:
            if args.output_type == 'icebreaker':
                print("\n--- Generated Ice Breaker ---")
            else:
                print("\n--- Generated Email ---")
            for result in results:
                print(f"Name: {result['first_name']} {result['last_name']}")
                print(f"Company: {result['companyName']}")
                print(f"Email: {result['email']}")
                print(f"Industry: {result['industry']}")
                if args.output_type == 'icebreaker':
                    print(f"Ice Breaker: {result['ice_breaker']}")
                else:
                    print("Email:\n" + result['email_body'])
                print("-" * 50)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 